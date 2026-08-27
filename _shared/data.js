/*
 * Shared fixture data
 * -------------------
 *   <script src="../_shared/data.js"></script>
 *
 * One set of records, used by every prototype. This is what makes the repo feel
 * like one product rather than a folder of unrelated screens: the order you click
 * in the list is the order you land on in the detail, because both read the same
 * object.
 *
 * Rules for this file:
 *
 *   · Every record needs a stable `id`. That id is what a link carries between
 *     prototypes (?id=…), so renaming one breaks existing links.
 *   · Obviously fake, plausibly shaped. Never paste real customer data into a
 *     prototype — this repo is published to GitHub Pages.
 *   · Add fields freely. A detail prototype will need more than a list does, and
 *     an unused field costs nothing.
 *
 * Note on references: the Figma frames repeat CCA2023-000270.1 on every row,
 * which is fine for a static image but useless the moment rows become clickable.
 * These are distinct so each row leads somewhere different.
 */
(function () {
  'use strict';

  var ORDERS = [
    {
      id: 'CCA2023-000270.1',
      type: 'Brokerage',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046585 + 10046562',
      status: 'Searching for Carrier',
      statusFlavor: 'warning',
      transitStatus: 'On time',
      transitFlavor: 'match',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Presov_080 01', street: 'Hlavna ul. 27', city: '080 01 Presov', country: 'Slovakia', date: 'Thu, 27 Aug 2026', window: '08:00' },
      delivery: { name: 'Barcelona_08001', street: 'La Rambla, 88', city: '08001 Barcelona', country: 'Spain', date: 'Sun, 30 Aug 2026', window: '08:00' },
      stops: 2,
      distanceKm: 2247,
    },
    {
      id: 'CCA2023-000271.4',
      type: 'MT',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046585 + 10046562',
      status: 'New',
      statusFlavor: 'highlight',
      transitStatus: 'On time',
      transitFlavor: 'match',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Bréal-sous-Montfort', street: '625 Les Bruyères', city: '35310 Bréal-sous-Montfort', country: 'France', date: 'Fri, 28 Aug 2026', window: '09:30' },
      delivery: { name: 'São Sebastião', street: 'Unnamed Road', city: '7000 São Sebastião', country: 'Portugal', date: 'Tue, 1 Sept 2026', window: '14:00' },
      stops: 2,
      distanceKm: 1680,
    },
    {
      id: 'CCA2023-000272.2',
      type: 'Brokerage',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain España S.L.U',
      shipperReference: '10046590',
      status: 'Orders Generated',
      statusFlavor: 'primary',
      transitStatus: 'Early',
      transitFlavor: 'highlight',
      accountManager: 'Admin Bianca',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Rotterdam_3011', street: 'Wilhelminakade 179', city: '3072 AP Rotterdam', country: 'Netherlands', date: 'Wed, 26 Aug 2026', window: '07:00' },
      delivery: { name: 'Berlin_10115', street: 'Invalidenstraße 50', city: '10557 Berlin', country: 'Germany', date: 'Thu, 27 Aug 2026', window: '16:00' },
      stops: 3,
      distanceKm: 712,
    },
    {
      id: 'CCA2023-000273.7',
      type: 'Brokerage',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046601 + 10046602',
      status: 'Searching for Carrier',
      statusFlavor: 'warning',
      transitStatus: 'In Transit',
      transitFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Antwerp_2000', street: 'Noorderlaan 127', city: '2030 Antwerpen', country: 'Belgium', date: 'Mon, 24 Aug 2026', window: '06:00' },
      delivery: { name: 'Lyon_69000', street: "12 Quai Perrache", city: '69002 Lyon', country: 'France', date: 'Tue, 25 Aug 2026', window: '18:00' },
      stops: 2,
      distanceKm: 934,
    },
  ];

  window.CCA_DATA = {
    orders: ORDERS,
    order: function (id) {
      return ORDERS.filter(function (o) { return o.id === id; })[0] || null;
    },
  };
})();
