/**
 * Rewrites Angular's view-encapsulation pseudo-selectors into plain CSS so a
 * component's stylesheet works outside an Angular app.
 *
 * Angular never ships `:host` / `::ng-deep` to the browser — it rewrites them
 * against the component's generated `_nghost-*` / `_ngcontent-*` attributes.
 * The design-system export has no such attributes, so each pseudo-selector is
 * resolved against the component's real host class instead:
 *
 *   :host                     ->  .cca-btn
 *   :host(.cca-btn--small)    ->  .cca-btn.cca-btn--small
 *   :host:disabled            ->  .cca-btn:disabled
 *   :host ::ng-deep cca-icon  ->  .cca-btn cca-icon
 *   :host-context(.dark)      ->  .dark .cca-btn
 *
 * The specificity that encapsulation would have added is deliberately not
 * reproduced here — precedence is modelled with CSS cascade layers instead, so
 * the emitted selectors stay readable and match what a developer would write.
 */

import postcss, { type Rule } from 'postcss';

/** A `:host` occurrence that could not be resolved to a plain selector. */
export interface DeAngularizeWarning {
  readonly selector: string;
  readonly reason: string;
}

/** Result of rewriting one component stylesheet. */
export interface DeAngularizeResult {
  readonly css: string;
  readonly warnings: readonly DeAngularizeWarning[];
}

// Matches `:host(<args>)` and captures the argument list, allowing nested
// parens one level deep (`:host(.a:not(.b))`).
const HOST_WITH_ARGS = /:host\(((?:[^()]|\([^()]*\))*)\)/g;
const HOST_CONTEXT_WITH_ARGS = /:host-context\(((?:[^()]|\([^()]*\))*)\)/g;

/**
 * Rewrites a single selector. `rootSelector` is the component's host selector
 * — for `ccaButton` that is `.cca-btn`, the class Angular puts on the element.
 */
export function rewriteSelector(selector: string, rootSelector: string): string {
  // `:host-context(.dark)` scopes on an ancestor, so the argument moves in front.
  let rewritten = selector.replace(
    HOST_CONTEXT_WITH_ARGS,
    (_match, args: string) => `${args.trim()} ${rootSelector}`,
  );

  // `:host(.x)` narrows the host itself — the argument attaches to the root.
  rewritten = rewritten.replace(
    HOST_WITH_ARGS,
    (_match, args: string) => `${rootSelector}${args.trim()}`,
  );

  // Bare `:host`, plus any `:host:pseudo` / `:host::before` form.
  rewritten = rewritten.replace(/:host\b/g, rootSelector);

  // `::ng-deep` pierces encapsulation, which plain CSS does by default. Drop
  // the pseudo-element and let the surrounding combinator stand on its own.
  rewritten = rewritten.replace(/\s*::ng-deep\s*/g, ' ');

  // A stylesheet that only ever used `::ng-deep` without `:host` was still
  // scoped to the component in Angular, so scope it explicitly here.
  if (!rewritten.includes(rootSelector)) {
    rewritten = `${rootSelector} ${rewritten}`;
  }

  return rewritten.replace(/\s+/g, ' ').trim();
}

/**
 * Rewrites every selector in a compiled component stylesheet.
 * `rootSelector` must be the class Angular applies to the host element.
 */
export function deAngularize(css: string, rootSelector: string): DeAngularizeResult {
  const warnings: DeAngularizeWarning[] = [];
  const root = postcss.parse(css);

  root.walkRules((rule: Rule) => {
    // Selectors inside `@keyframes` are percentages, not element selectors.
    if (rule.parent?.type === 'atrule') {
      const atRuleName = (rule.parent as { name?: string }).name ?? '';
      if (/keyframes$/.test(atRuleName)) {
        return;
      }
    }

    rule.selectors = rule.selectors.map((selector) => {
      const rewritten = rewriteSelector(selector, rootSelector);

      if (rewritten.includes(':host') || rewritten.includes('::ng-deep')) {
        warnings.push({
          selector,
          reason: 'Unresolved encapsulation pseudo-selector after rewrite',
        });
      }

      return rewritten;
    });
  });

  return { css: root.toString(), warnings };
}
