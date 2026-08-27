/**
 * Generates the input page and the selection-controls page.
 *
 * Every field is real `mat-form-field` DOM rendered against the exported
 * Material CSS, frozen into one explicit state per sample. A static page that
 * spells out empty / filled / focused / error / disabled side by side documents
 * the control better than a live widget showing one state at a time.
 */

import { checkbox, formField, radio, resetFieldIds, slideToggle } from './material-dom.js';
import { type ShapeMetrics, remToPx } from './parse-metrics.js';
import { buildPage, callout, codeCard, escapeHtml, section } from './page-shell.js';

/** A labelled row of demo items in the shell's variant-grid styling. */
function variantRow(label: string, items: string): string {
  return [
    '<div class="variant-row">',
    `  <div class="vr-label">${escapeHtml(label)}</div>`,
    `  <div class="vr-items">${items}</div>`,
    '</div>',
  ].join('\n');
}

/** The input / form-field page. */
export function inputPage(metrics: ShapeMetrics): string {
  resetFieldIds();

  const infixHeight = remToPx(metrics.formFieldInfixMinHeight) ?? '48px';

  const states = [
    variantRow('Empty — label at rest', formField({ label: 'Reference' })),
    variantRow(
      'Filled — label floats into the notch',
      formField({ label: 'Reference', value: 'CCA-4281' }),
    ),
    variantRow(
      'Focused — 2px brand outline',
      formField({ label: 'Reference', state: 'focused', value: 'CCA-4281' }),
    ),
    variantRow(
      'Error — outline, label and message all turn critical',
      formField({
        label: 'Reference',
        state: 'error',
        value: 'CCA-42',
        error: 'Reference must be 8 characters',
      }),
    ),
    variantRow('Disabled', formField({ label: 'Reference', state: 'disabled', value: 'CCA-4281' })),
    variantRow(
      'Required — asterisk from the floating label',
      formField({ label: 'Reference', required: true }),
    ),
  ].join('\n');

  const affixes = [
    variantRow(
      'Icon prefix',
      formField({ label: 'Search', prefixIcon: 'search', value: 'Rotterdam' }),
    ),
    variantRow(
      'Icon suffix',
      formField({ label: 'Delivery date', suffixIcon: 'calendar', value: '2026-09-01' }),
    ),
    variantRow('Hint', formField({ label: 'Weight', value: '18000', hint: 'Kilograms, gross' })),
    variantRow(
      'Multiline',
      formField({ label: 'Instructions', multiline: true, value: 'Call ahead on arrival.' }),
    ),
  ].join('\n');

  const selection = [
    variantRow(
      'Checkbox',
      [
        checkbox({ label: 'Unchecked' }),
        checkbox({ label: 'Checked', checked: true }),
        checkbox({ label: 'Disabled', disabled: true }),
        checkbox({ label: 'Disabled checked', checked: true, disabled: true }),
      ].join('\n    '),
    ),
    variantRow(
      'Radio',
      [
        radio({ label: 'Unselected' }),
        radio({ label: 'Selected', checked: true }),
        radio({ label: 'Disabled', disabled: true }),
      ].join('\n    '),
    ),
    variantRow(
      'Switch',
      [
        slideToggle({ label: 'Off' }),
        slideToggle({ label: 'On', checked: true }),
        slideToggle({ label: 'Disabled', disabled: true }),
      ].join('\n    '),
    ),
  ].join('\n');

  const usageSample = [
    '<mat-form-field>',
    "  <mat-label>{{ t('order.reference') }}</mat-label>",
    '  <input matInput [formControl]="form.controls.reference" />',
    "  <mat-error>{{ t('order.referenceInvalid') }}</mat-error>",
    '</mat-form-field>',
    '',
    '<!-- with a leading icon -->',
    '<mat-form-field>',
    "  <mat-label>{{ t('common.search') }}</mat-label>",
    '  <cca-icon matPrefix icon="search" />',
    '  <input matInput [formControl]="form.controls.query" />',
    '</mat-form-field>',
  ].join('\n');

  const layoutSample = [
    '<!-- items-start is required: each field reserves its own subscript space, -->',
    '<!-- so rows with and without an error would otherwise drift apart.        -->',
    '<div class="grid grid-cols-2 items-start gap-4">',
    '  <mat-form-field>…</mat-form-field>',
    '  <mat-form-field>…</mat-form-field>',
    '</div>',
  ].join('\n');

  const body = [
    section(
      'Anatomy',
      `<p class="lede">Appearance is <strong>outlined</strong> everywhere — there is no filled variant in the platform. The infix is ${escapeHtml(infixHeight)} tall with <code>${escapeHtml(metrics.formFieldInfixPadding ?? '0.75rem 0')}</code> padding, which is why a field and a <code>size="default"</code> button line up without any alignment work.</p>`,
      codeCard('template', usageSample),
    ),
    section('States', `<div class="variant-grid">${states}</div>`),
    section('Prefixes, suffixes and hints', `<div class="variant-grid">${affixes}</div>`),
    section(
      'In a form',
      codeCard('template', layoutSample),
      callout(
        'warn',
        'Never add bottom margin to a form field',
        '<p>The subscript area below the input already reserves room for a hint or error. Adding margin double-spaces the row, and the drift only becomes visible once one field in a row shows an error and its neighbours do not.</p>',
      ),
    ),
    section(
      'Selection controls',
      '<p class="lede">Checkbox, radio and switch are Material controls themed by the platform. The switch is <code>mat-slide-toggle</code> — there is no separate switch component.</p>',
      `<div class="variant-grid">${selection}</div>`,
    ),
    section(
      'The compact exception',
      callout(
        'info',
        `A field inside a paginator is ${escapeHtml(remToPx(metrics.paginatorInfixMinHeight) ?? '32px')} tall`,
        `<p>Page-size selects inside <code>mat-paginator</code> are the one place the platform shrinks a field, down from ${escapeHtml(infixHeight)}. Do not reuse that height elsewhere.</p>`,
      ),
    ),
  ].join('\n');

  return buildPage({
    path: 'components/input.html',
    group: 'Components',
    subtitle: `Outlined only · ${infixHeight} infix · states, affixes, selection controls`,
    title: 'Input',
    intro:
      'Real mat-form-field DOM rendered against the platform’s own Material CSS and overrides — each sample frozen in one explicit state.',
    crumbs: ['Components', 'Input'],
    sources: [
      'shared/styles/components/_form-field.scss',
      'shared/styles/components/_checkbox.scss',
      'shared/styles/components/_radio.scss',
      'shared/styles/components/_switch.scss',
    ],
    devSelectors: [
      'matInput',
      'mat-form-field',
      'mat-checkbox',
      'mat-radio-button',
      'mat-slide-toggle',
    ],
    body,
  });
}
