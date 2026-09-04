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
      transitFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Presov DC 1', street: 'Hlavna ul. 27', city: '080 01 Presov', country: 'Slovakia', date: 'Thu, 27 Aug 2026', window: '08:00' },
      delivery: { name: 'Ingram Micro Barcelona', street: 'La Rambla, 88', city: '08001 Barcelona', country: 'Spain', date: 'Sun, 30 Aug 2026', window: '08:00' },
      stops: 2,
      distanceKm: 2247,
      domain: 'transport',
      tripReference: 'TRIP2026-020684',
      carrierGroup: 'TRANSPORTES GARCÍA DE LA TORRE S.L.',
      carrierSubGroup: 'TGF Valencia',
      shipmentIssues: false,
      podApproved: false,
      createdAt: 'Mon, 17 Aug 2026',
      createdTime: '08:00',
linked: ['CCA2023-000418.1', 'CCA2023-000501.1'],
    },
    {
      id: 'CCA2023-000271.4',
      type: 'MT',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046585 + 10046562',
      status: 'New',
      statusFlavor: 'neutral',
      transitStatus: 'On time',
      transitFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Rotterdam DC 3', street: 'Wilhelminakade 179', city: '3072 AP Rotterdam', country: 'Netherlands', date: 'Wed, 26 Aug 2026', window: '09:30' },
      delivery: { name: 'Ingram Micro Berlin', street: 'Invalidenstraße 50', city: '10557 Berlin', country: 'Germany', date: 'Thu, 27 Aug 2026', window: '14:00' },
      stops: 2,
      distanceKm: 1680,
      domain: 'transport',
      tripReference: 'TRIP2026-020456',
      carrierGroup: 'Van Dijk Transport B.V.',
      carrierSubGroup: 'Van Dijk Rotterdam',
      shipmentIssues: false,
      podApproved: false,
      createdAt: 'Tue, 18 Aug 2026',
      createdTime: '09:12',
linked: ['CCA2023-000420.1'],
    },
    {
      id: 'CCA2023-000272.2',
      type: 'Brokerage',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain España S.L.U',
      shipperReference: '10046590',
      status: 'In Transit',
      statusFlavor: 'accent-blue',
      transitStatus: 'Early',
      transitFlavor: 'accent-blue',
      accountManager: 'Admin Bianca',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Rotterdam DC 3', street: 'Wilhelminakade 179', city: '3072 AP Rotterdam', country: 'Netherlands', date: 'Wed, 26 Aug 2026', window: '07:00' },
      delivery: { name: 'Ingram Micro Berlin', street: 'Invalidenstraße 50', city: '10557 Berlin', country: 'Germany', date: 'Thu, 27 Aug 2026', window: '16:00' },
      stops: 3,
      distanceKm: 712,
      domain: 'transport',
      tripReference: 'TRIP2026-020457',
      carrierGroup: 'Van Dijk Transport B.V.',
      carrierSubGroup: 'Van Dijk Rotterdam',
      shipmentIssues: false,
      podApproved: true,
      createdAt: 'Tue, 18 Aug 2026',
      createdTime: '09:14',
linked: ['CCA2023-000420.1'],
    },
    {
      id: 'CCA2023-000273.7',
      type: 'Brokerage',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046601 + 10046602',
      status: 'Missing POD',
      statusFlavor: 'danger',
      transitStatus: 'Late',
      transitFlavor: 'danger',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Antwerp DC 2', street: 'Noorderlaan 127', city: '2030 Antwerpen', country: 'Belgium', date: 'Mon, 24 Aug 2026', window: '06:00' },
      delivery: { name: 'Ingram Micro Lyon', street: "12 Quai Perrache", city: '69002 Lyon', country: 'France', date: 'Tue, 25 Aug 2026', window: '18:00' },
      stops: 2,
      distanceKm: 934,
      domain: 'transport',
      tripReference: 'TRIP2026-019672',
      carrierGroup: 'Ardennes Fret SA',
      carrierSubGroup: 'AF Liège',
      shipmentIssues: true,
      podApproved: false,
      createdAt: 'Fri, 14 Aug 2026',
      createdTime: '15:40',
linked: ['CCA2023-000422.1'],
    },
    {
      id: 'CCA2023-000274.1',
      type: 'SAAS',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046612',
      status: 'Carrier Informed',
      statusFlavor: 'accent-blue',
      transitStatus: 'On time',
      transitFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Venlo DC 1', street: 'Columbusweg 31', city: '5928 LC Venlo', country: 'Netherlands', date: 'Fri, 28 Aug 2026', window: '10:00' },
      delivery: { name: 'Ingram Micro Milano', street: 'Via Mecenate 90', city: '20138 Milano', country: 'Italy', date: 'Mon, 31 Aug 2026', window: '11:30' },
      stops: 2,
      distanceKm: 1043,
      domain: 'transport',
      tripReference: 'TRIP2026-019171',
      carrierGroup: 'Autotrasporti Lombardi S.p.A.',
      carrierSubGroup: 'AL Milano',
      shipmentIssues: false,
      podApproved: false,
      createdAt: 'Wed, 19 Aug 2026',
      createdTime: '11:05',
linked: ['CCA2023-000503.1'],
    },
    {
      id: 'CCA2023-000275.2',
      type: 'Own Fleet',
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Deutschland',
      salesOrganisation: 'CtrlChain GmbH',
      shipperReference: '10046620',
      status: 'Completed',
      statusFlavor: 'primary',
      transitStatus: 'On time',
      transitFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Duisburg DC 1', street: 'Am Blumenkampshof 8', city: '47059 Duisburg', country: 'Germany', date: 'Mon, 31 Aug 2026', window: '07:00' },
      delivery: { name: 'Nordfracht Logistik GmbH', street: 'Grosse Elbstrasse 145', city: '22767 Hamburg', country: 'Germany', date: 'Tue, 1 Sept 2026', window: '15:00' },
      stops: 2,
      distanceKm: 449,
      domain: 'transport',
      tripReference: 'TRIP2026-017671',
      carrierGroup: 'CtrlChain Own Fleet',
      carrierSubGroup: 'Fleet Duisburg',
      shipmentIssues: false,
      podApproved: true,
      createdAt: 'Thu, 20 Aug 2026',
      createdTime: '07:30',
linked: [],
    },
  ];


  /*
   * Warehouse orders — OMS
   * ----------------------
   * The warehouse side of the same goods the transport orders move. Kept in its
   * OWN array rather than appended to ORDERS, deliberately: every prototype
   * reading `CCA_DATA.orders` today means "transport orders", and quietly
   * doubling that array would put warehouse rows into the pinned-filters
   * prototype with no transit status to render. A screen that wants both asks
   * for both — `CCA_DATA.allOrders()`.
   *
   * `type` is the warehouse movement: Inbound is goods arriving, Outbound is
   * goods leaving. The reference number carries the SAME `CCA` prefix as a
   * transport order — the domain is the `type`, never the reference. These sit
   * in their own number block only because they were created later; one series
   * with gaps in it is what the real sequence looks like. `linked` is the transport orders that carry this order's
   * goods, which is the whole reason the two lists are being combined — an
   * Outbound order and the transport order collecting it are one job to an
   * operator, and two records to the system.
   *
   * Addresses carry name, street, postal city and country — the four lines the
   * Orders list renders them on. The postcode lives in `city`, as it does in
   * the transport records, so both domains format identically.
   *
   * STATUSES ARE THE REAL LIFECYCLE, not invented ones. In order:
   *
   *     Registered -> Ready to Ship -> Truck Arrived -> Loaded
   *                -> Departed -> Delivered
   *
   * That is the Outbound run; an Inbound ends at Received rather than
   * Delivered (the OMS warehouse table shows Received on its Inbound rows and
   * Departed on its Outbound ones). Earlier revisions of this file guessed at
   * Slot Booked / Picking / Ready for Dispatch / Awaiting Slot / Slot Missed —
   * none of which exist.
   *
   * `statusFlavor` follows the badge component's tone guidance: green is for a
   * "final or positive outcome" only, so Delivered and Received are `primary`
   * and everything else in the lifecycle — Registered included — is
   * `accent-blue`. Explicitly NOT green for in-progress states, which the
   * component's own description warns against.
   *
   * There is no failure status here, and that is not an omission: the warehouse
   * table carries exceptions in their own Shortage and NCR columns rather than
   * in Status.
   *
   * The fixtures run chronologically — the earliest dates are furthest along
   * the lifecycle, the latest is only just Registered.
   *
   * An empty `linked` is a real case, not missing data: an Inbound where the
   * supplier arranges its own haulage has no CtrlChain transport order at all.
   *
   * `warehouseSide` says which end the DC is on, so a screen can mark it
   * without re-deriving it from the type: an Outbound leaves the warehouse, an
   * Inbound arrives at it.
   *
   * A `window` is { from, to } — two SEPARATE times, never a pre-joined
   * "06:00 – 08:00" string. A screen has to be able to put its own separator
   * between them, and each time has to be sortable and filterable on its own:
   * "arriving after 13:00" is a question about one end of the window, not the
   * pair. `to` is null for a single point in time rather than a window. The
   * whole window is null where no dock slot is booked yet, and `slotStatus`
   * then says what to show in its place.
   *
   * `toDate` is set ONLY when the window crosses midnight — a night loading
   * slot that starts at 22:00 and finishes at 02:00 the next day. Absent is
   * the normal case and means "same day as `date`", so a screen shows the
   * second date only when it actually differs. The running app prints both
   * dates unconditionally, which is why its cells repeat themselves on every
   * same-day window.
   */
  var WAREHOUSE_ORDERS = [
    {
      id: 'CCA2023-000418.1',
      /* The reference the shipper's own system gave this order. Distinct
         from shipperReference, which is the number the Orders table shows. */
      externalReference: 'EXT-4471820',
      /* Shown as "Temperature Profile code" above Order Items. */
      temperatureProfile: '36.1 - 37.2 °C',
      /* The haulier that collects or delivers at the dock. A warehouse order
         HAS a carrier — the timeline's "Truck Arrived" is theirs — but
         CtrlChain does not invoice it, which is why Finance Summary still
         shows no Carrier Invoice Status. */
      carrierGroup: 'Van Dijk Transport B.V.',
      carrierSubGroup: 'Van Dijk Zeeland',
      warehouseVehicle: { plate: 'BX-472-K', driver: 'Rens de Groot', phone: '+31 113 55 21 40' },
      /* Not Sent -> Uploaded -> Approved. Distinct from transport's
         podApproved boolean, which cannot express "uploaded but not yet
         signed off" — the state that decides whether there is a document
         to download at all. */
      podStatus: 'Uploaded',
      /* The shipper's own contact. ORDER_DETAIL.contacts.shipper is the
         transport fixture's Booker; a warehouse order's counterpart is the
         client, so it carries its own rather than borrowing that one. */
      shipperContact: { initials: 'JB', name: 'Joost Bakker', role: 'Client', email: 'joost.bakker@example.com' },
      /* Three trip numbers, not a contracted lane: the warehouse's own,
         the transport leg's if one is linked, and the customer's if they
         gave one. N/A is a real state here, not missing fixture data. */
      tripNumbers: { warehouse: '24655', transport: 'TRIP2026-020684', customer: null },
      domain: 'warehouse',
      type: 'Outbound',
      shipperGroup: 'Farm Pack BV',
      shipperSubGroup: 'Farm Pack Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046585',
      status: 'Loaded',
      statusFlavor: 'accent-blue',
      warehouse: { name: 'Presov DC 1', street: 'Hlavna ul. 27', city: '080 01 Presov', country: 'Slovakia', dock: 'Dock 7' },
      warehouseSide: 'origin',
      origin: { name: '', street: 'Nishoek 2', city: 'Kruiningen, 4416 PE', country: 'NL', date: 'Wed, 26 Aug 2026', window: { from: '22:00', to: '02:00', toDate: 'Thu, 27 Aug 2026' } },
      destination: { name: 'Heywood Coldstore', street: 'Hareshill Road', city: 'Heywood/Lancashire, OL10 2TP', country: '044', date: 'Sun, 30 Aug 2026', window: { from: '08:00', to: null } },
      lines: 14,
      pallets: 18,
      weightKg: 7420,
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      tripReference: 'TRIP2026-020684',
      createdAt: 'Mon, 17 Aug 2026',
      createdTime: '08:04',
linked: ['CCA2023-000270.1'],
    },
    {
      id: 'CCA2023-000419.2',
      /* The reference the shipper's own system gave this order. Distinct
         from shipperReference, which is the number the Orders table shows. */
      externalReference: 'EXT-4471964',
      /* Shown as "Temperature Profile code" above Order Items. */
      temperatureProfile: '36.1 - 37.2 °C',
      /* The haulier that collects or delivers at the dock. A warehouse order
         HAS a carrier — the timeline's "Truck Arrived" is theirs — but
         CtrlChain does not invoice it, which is why Finance Summary still
         shows no Carrier Invoice Status. */
      carrierGroup: 'Van Dijk Transport B.V.',
      carrierSubGroup: 'Van Dijk Zeeland',
      warehouseVehicle: { plate: 'BX-118-P', driver: 'Rens de Groot', phone: '+31 113 55 21 40' },
      /* Not Sent -> Uploaded -> Approved. Distinct from transport's
         podApproved boolean, which cannot express "uploaded but not yet
         signed off" — the state that decides whether there is a document
         to download at all. */
      podStatus: 'Not Sent',
      /* The shipper's own contact. ORDER_DETAIL.contacts.shipper is the
         transport fixture's Booker; a warehouse order's counterpart is the
         client, so it carries its own rather than borrowing that one. */
      shipperContact: { initials: 'JB', name: 'Joost Bakker', role: 'Client', email: 'joost.bakker@example.com' },
      /* Three trip numbers, not a contracted lane: the warehouse's own,
         the transport leg's if one is linked, and the customer's if they
         gave one. N/A is a real state here, not missing fixture data. */
      tripNumbers: { warehouse: '24655', transport: null, customer: null },
      domain: 'warehouse',
      type: 'Inbound',
      shipperGroup: 'Farm Pack BV',
      shipperSubGroup: 'Farm Pack Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046612',
      status: 'Truck Arrived',
      statusFlavor: 'accent-blue',
      warehouse: { name: 'Venlo DC 1', street: 'Columbusweg 31', city: '5928 LC Venlo', country: 'Netherlands', dock: 'Dock 3' },
      warehouseSide: 'destination',
      origin: { name: 'Elektro Components Sp. z o.o.', street: 'ul. Chorzowska 50', city: '40-121 Katowice', country: 'Poland', date: 'Wed, 26 Aug 2026', window: { from: '16:00', to: null } },
      destination: { name: 'Venlo DC 1', street: 'Columbusweg 31', city: '5928 LC Venlo', country: 'Netherlands', date: 'Fri, 28 Aug 2026', window: { from: '13:00', to: '15:00' } },
      lines: 6,
      pallets: 9,
      weightKg: 3180,
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      tripReference: null,
      createdAt: 'Mon, 17 Aug 2026',
      createdTime: '16:22',
linked: [],
    },
    {
      id: 'CCA2023-000420.1',
      /* The reference the shipper's own system gave this order. Distinct
         from shipperReference, which is the number the Orders table shows. */
      externalReference: 'EXT-4472115',
      /* Shown as "Temperature Profile code" above Order Items. */
      temperatureProfile: '36.1 - 37.2 °C',
      /* The haulier that collects or delivers at the dock. A warehouse order
         HAS a carrier — the timeline's "Truck Arrived" is theirs — but
         CtrlChain does not invoice it, which is why Finance Summary still
         shows no Carrier Invoice Status. */
      carrierGroup: 'Rotterdam Haulage N.V.',
      carrierSubGroup: 'RH Zuid-Holland',
      warehouseVehicle: { plate: 'RH-903-T', driver: 'Milan Visser', phone: '+31 10 240 88 12' },
      /* Not Sent -> Uploaded -> Approved. Distinct from transport's
         podApproved boolean, which cannot express "uploaded but not yet
         signed off" — the state that decides whether there is a document
         to download at all. */
      podStatus: 'Not Sent',
      /* The shipper's own contact. ORDER_DETAIL.contacts.shipper is the
         transport fixture's Booker; a warehouse order's counterpart is the
         client, so it carries its own rather than borrowing that one. */
      shipperContact: { initials: 'SM', name: 'Sanne Meijer', role: 'Client', email: 'sanne.meijer@example.com' },
      /* Three trip numbers, not a contracted lane: the warehouse's own,
         the transport leg's if one is linked, and the customer's if they
         gave one. N/A is a real state here, not missing fixture data. */
      tripNumbers: { warehouse: '24702', transport: 'TRIP2026-020456', customer: 'CT-88417' },
      domain: 'warehouse',
      type: 'Outbound',
      shipperGroup: 'Farm Pack BV',
      shipperSubGroup: 'Farm Pack Netherlands',
      salesOrganisation: 'CtrlChain España S.L.U',
      shipperReference: '10046590 + 10046591',
      status: 'Departed',
      statusFlavor: 'accent-blue',
      warehouse: { name: 'Rotterdam DC 3', street: 'Wilhelminakade 179', city: '3072 AP Rotterdam', country: 'Netherlands', dock: 'Dock 2' },
      warehouseSide: 'origin',
      origin: { name: 'Rotterdam DC 3', street: 'Wilhelminakade 179', city: '3072 AP Rotterdam', country: 'Netherlands', date: 'Wed, 26 Aug 2026', window: { from: '09:00', to: '11:00' } },
      destination: { name: 'Ingram Micro Berlin', street: 'Invalidenstraße 50', city: '10557 Berlin', country: 'Germany', date: 'Thu, 27 Aug 2026', window: { from: '14:00', to: null } },
      lines: 31,
      pallets: 33,
      weightKg: 14960,
      accountManager: 'Admin Bianca',
      assignedOperator: 'Sanne Meijer',
      tripReference: 'TRIP2026-020456',
      createdAt: 'Tue, 18 Aug 2026',
      createdTime: '09:15',
linked: ['CCA2023-000271.4', 'CCA2023-000272.2'],
    },
    {
      id: 'CCA2023-000421.3',
      /* The reference the shipper's own system gave this order. Distinct
         from shipperReference, which is the number the Orders table shows. */
      externalReference: 'EXT-4472240',
      /* Shown as "Temperature Profile code" above Order Items. */
      temperatureProfile: '36.1 - 37.2 °C',
      /* The haulier that collects or delivers at the dock. A warehouse order
         HAS a carrier — the timeline's "Truck Arrived" is theirs — but
         CtrlChain does not invoice it, which is why Finance Summary still
         shows no Carrier Invoice Status. */
      carrierGroup: 'Spedition Vogel GmbH',
      carrierSubGroup: 'Vogel Nordrhein',
      warehouseVehicle: { plate: 'K-VG 4471', driver: 'Lars Brandt', phone: '+49 221 55 90 33' },
      /* Not Sent -> Uploaded -> Approved. Distinct from transport's
         podApproved boolean, which cannot express "uploaded but not yet
         signed off" — the state that decides whether there is a document
         to download at all. */
      podStatus: 'Not Sent',
      /* The shipper's own contact. ORDER_DETAIL.contacts.shipper is the
         transport fixture's Booker; a warehouse order's counterpart is the
         client, so it carries its own rather than borrowing that one. */
      shipperContact: { initials: 'KV', name: 'Katrin Vogel', role: 'Client', email: 'katrin.vogel@example.com' },
      /* Three trip numbers, not a contracted lane: the warehouse's own,
         the transport leg's if one is linked, and the customer's if they
         gave one. N/A is a real state here, not missing fixture data. */
      tripNumbers: { warehouse: '24688', transport: null, customer: 'CT-88392' },
      domain: 'warehouse',
      type: 'Inbound',
      shipperGroup: 'Farm Pack BV',
      shipperSubGroup: 'Farm Pack Deutschland',
      salesOrganisation: 'CtrlChain GmbH',
      shipperReference: '10046620',
      status: 'Registered',
      statusFlavor: 'accent-blue',
      warehouse: { name: 'Duisburg DC 1', street: 'Am Blumenkampshof 8', city: '47059 Duisburg', country: 'Germany', dock: null },
      warehouseSide: 'destination',
      origin: { name: 'Nordfracht Logistik GmbH', street: 'Grosse Elbstrasse 145', city: '22767 Hamburg', country: 'Germany', date: 'Sun, 30 Aug 2026', window: { from: '11:00', to: null } },
      destination: { name: 'Duisburg DC 1', street: 'Am Blumenkampshof 8', city: '47059 Duisburg', country: 'Germany', date: 'Mon, 31 Aug 2026', window: null, slotStatus: 'To be confirmed' },
      lines: 4,
      pallets: 5,
      weightKg: 1240,
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      tripReference: null,
      createdAt: 'Fri, 28 Aug 2026',
      createdTime: '10:01',
linked: [],
    },
    {
      id: 'CCA2023-000422.1',
      /* The reference the shipper's own system gave this order. Distinct
         from shipperReference, which is the number the Orders table shows. */
      externalReference: 'EXT-4472388',
      /* Shown as "Temperature Profile code" above Order Items. */
      temperatureProfile: '36.1 - 37.2 °C',
      /* The haulier that collects or delivers at the dock. A warehouse order
         HAS a carrier — the timeline's "Truck Arrived" is theirs — but
         CtrlChain does not invoice it, which is why Finance Summary still
         shows no Carrier Invoice Status. */
      carrierGroup: 'Van Dijk Transport B.V.',
      carrierSubGroup: 'Van Dijk Zeeland',
      warehouseVehicle: { plate: 'BX-472-K', driver: 'Rens de Groot', phone: '+31 113 55 21 40' },
      /* Not Sent -> Uploaded -> Approved. Distinct from transport's
         podApproved boolean, which cannot express "uploaded but not yet
         signed off" — the state that decides whether there is a document
         to download at all. */
      podStatus: 'Approved',
      /* The shipper's own contact. ORDER_DETAIL.contacts.shipper is the
         transport fixture's Booker; a warehouse order's counterpart is the
         client, so it carries its own rather than borrowing that one. */
      shipperContact: { initials: 'JB', name: 'Joost Bakker', role: 'Client', email: 'joost.bakker@example.com' },
      /* Three trip numbers, not a contracted lane: the warehouse's own,
         the transport leg's if one is linked, and the customer's if they
         gave one. N/A is a real state here, not missing fixture data. */
      tripNumbers: { warehouse: '24711', transport: 'TRIP2026-019672', customer: null },
      domain: 'warehouse',
      type: 'Outbound',
      shipperGroup: 'Farm Pack BV',
      shipperSubGroup: 'Farm Pack Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046601',
      status: 'Delivered',
      statusFlavor: 'primary',
      warehouse: { name: 'Antwerp DC 2', street: 'Noorderlaan 127', city: '2030 Antwerpen', country: 'Belgium', dock: 'Dock 1' },
      warehouseSide: 'origin',
      origin: { name: 'Antwerp DC 2', street: 'Noorderlaan 127', city: '2030 Antwerpen', country: 'Belgium', date: 'Mon, 24 Aug 2026', window: { from: '05:00', to: '07:00' } },
      destination: { name: 'Ingram Micro Lyon', street: '12 Quai Perrache', city: '69002 Lyon', country: 'France', date: 'Tue, 25 Aug 2026', window: { from: '18:00', to: null } },
      lines: 11,
      pallets: 12,
      weightKg: 5380,
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      tripReference: 'TRIP2026-019672',
      createdAt: 'Fri, 14 Aug 2026',
      createdTime: '15:44',
linked: ['CCA2023-000273.7'],
    },
  ];


  /*
   * Invoice orders
   * --------------
   * The third domain in the combined list. Unlike the other two these have NO
   * type: there is no invoice equivalent of Brokerage or Inbound, so `type` is
   * null and the type-badge cell says so rather than sitting empty.
   *
   * Same array-per-domain pattern as WAREHOUSE_ORDERS, and for the same
   * reason: `CCA_DATA.orders` means transport orders to every prototype that
   * already reads it.
   *
   * `status` IS THE SHARED ORDER STATUS, not an invoicing state. An invoice
   * order is an order in the same list — the app hides them behind a "Show
   * Invoice Orders Only" filter rather than putting them somewhere else — so it
   * takes its status from the one vocabulary every order uses. "Paid" was wrong
   * for that reason: paid is Completed, and the invoicing state belongs in its
   * own field. The app has separate Customer Invoice Status and Carrier Invoice
   * Status filters, which is where `customerInvoiceStatus` comes from.
   *
   * ⚠ THE FIELD VALUES HERE ARE PLACEHOLDERS. These records come from an API
   * in the real product and its shape has not been read yet. What is modelled:
   * they carry the same columns as a transport order — origin, destination and
   * both date/time windows — because that is what the list needs in order to
   * show them at all.
   *
   * Two things are assumptions worth checking before anyone builds on this:
   *
   *   · `status` values (Invoice Sent / Paid / Overdue) are invented. The real
   *     vocabulary will come from the API.
   *   · NO `transitStatus`. An invoice is not in transit, so the Status column
   *     renders one badge for these rather than stacking a timeliness line
   *     under it — the same treatment warehouse orders get.
   *
   * `linked` is the transport order an invoice bills. An unlinked invoice is a
   * real case, not missing data — an advance or standalone invoice bills no
   * single order.
   */
  var INVOICE_ORDERS = [
    {
      id: 'CCA2023-000501.1',
      domain: 'invoice',
      type: null,
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046585',
      status: 'Completed',
      statusFlavor: 'primary',
      customerInvoiceStatus: 'Sent',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Presov DC 1', street: 'Hlavna ul. 27', city: '080 01 Presov', country: 'Slovakia', date: 'Thu, 27 Aug 2026', window: '08:00' },
      delivery: { name: 'Ingram Micro Barcelona', street: 'La Rambla, 88', city: '08001 Barcelona', country: 'Spain', date: 'Sun, 30 Aug 2026', window: '08:00' },
      tripReference: 'TRIP2026-020684',
      createdAt: 'Sun, 30 Aug 2026',
      createdTime: '02:00',
linked: ['CCA2023-000270.1'],
    },
    {
      id: 'CCA2023-000502.1',
      domain: 'invoice',
      type: null,
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Deutschland',
      salesOrganisation: 'CtrlChain GmbH',
      shipperReference: '10046620',
      status: 'Completed',
      statusFlavor: 'primary',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Sanne Meijer',
      pickup: { name: 'Duisburg DC 1', street: 'Am Blumenkampshof 8', city: '47059 Duisburg', country: 'Germany', date: 'Mon, 31 Aug 2026', window: '07:00' },
      delivery: { name: 'Nordfracht Logistik GmbH', street: 'Grosse Elbstrasse 145', city: '22767 Hamburg', country: 'Germany', date: 'Tue, 1 Sept 2026', window: '15:00' },
      tripReference: null,
      createdAt: 'Tue, 1 Sept 2026',
      createdTime: '02:00',
linked: [],
    },
    {
      id: 'CCA2023-000503.1',
      domain: 'invoice',
      type: null,
      shipperGroup: 'Ingram Micro Global',
      shipperSubGroup: 'Ingram Micro Netherlands',
      salesOrganisation: 'CtrlChain B.V.',
      shipperReference: '10046612',
      status: 'Completed',
      statusFlavor: 'primary',
      customerInvoiceStatus: 'Paid',
      accountManager: 'Bianca de Vries',
      assignedOperator: 'Tom Jansen',
      pickup: { name: 'Venlo DC 1', street: 'Columbusweg 31', city: '5928 LC Venlo', country: 'Netherlands', date: 'Fri, 28 Aug 2026', window: '10:00' },
      delivery: { name: 'Ingram Micro Milano', street: 'Via Mecenate 90', city: '20138 Milano', country: 'Italy', date: 'Mon, 31 Aug 2026', window: '11:30' },
      tripReference: 'TRIP2026-019171',
      createdAt: 'Mon, 31 Aug 2026',
      createdTime: '02:00',
linked: ['CCA2023-000274.1'],
    },
  ];


  /*
   * Order detail — the fields only a detail page needs
   * --------------------------------------------------
   * The list needs a dozen fields per order; the detail page needs sixty. Rather
   * than bloat every record, the extra sits here and is merged on demand by
   * `CCA_DATA.orderDetail(id)`.
   *
   * Read off the Basic Info tab of a real order at
   * development.ctrlchain.com/shipper-tms/order/detail/{ref}/info — the
   * STRUCTURE only. Every value is invented: that page carries live customer
   * data behind an ISO 27001 notice, and this repo publishes to GitHub Pages.
   *
   * `openingHours` is per-location and the app shows a "Show More" after five
   * days, so all seven are here to give that something to reveal.
   */
  /*
   * SHIPMENT TIMELINE — what the "Shipment updates" drawer shows.
   *
   * Read off staging's own drawer (cca-shipment-updates > cca-timeline-table),
   * so the SHAPE is the app's: events newest first, grouped under a collapsible
   * day, each carrying a time, the place it happened, a label and who recorded
   * it. Every value here is invented — staging is ISO 27001 and its data does
   * not leave it.
   *
   * Two vocabularies, because the two domains genuinely differ. Transport
   * tracks a road movement through to the POD; a warehouse order tracks the
   * handling lifecycle already in WAREHOUSE_ORDERS' own statuses.
   */
  var TIMELINE = {
    transport: [
      { day: 'Sunday, 30 August 2026', events: [
        { time: '14:22 CEST', place: '08001 Barcelona', label: 'POD Approved',
          note: 'Proof of delivery accepted; the order can now be invoiced.',
          by: 'Admin A. Kowalski' },
        { time: '14:18 CEST', place: '08001 Barcelona', label: 'POD Uploaded',
          note: 'Signed delivery note attached by the driver.', by: 'Marek Nowak' },
        { time: '14:05 CEST', place: '08001 Barcelona', label: 'Cargo Unloaded Confirmed',
          note: '10 of 10 pallets unloaded. No damage reported.', by: 'Marek Nowak' },
        { time: '13:30 CEST', place: '08001 Barcelona', label: 'Arrived at Delivery Confirmed',
          note: 'Arrived 30 minutes inside the booked window.', by: 'Marek Nowak' },
      ] },
      { day: 'Thursday, 27 August 2026', events: [
        { time: '09:12 CEST', place: '080 01 Presov', label: 'Cargo Loaded Confirmed',
          note: 'Loaded via door loading. Temperature set to -21 °C.', by: 'Marek Nowak' },
        { time: '08:05 CEST', place: '080 01 Presov', label: 'Arrived at Pickup Confirmed',
          note: 'Driver reported at the gate.', by: 'Marek Nowak' },
        { time: '07:40 CEST', place: '-', label: 'Pickup ETA Confirmed',
          note: 'Carrier confirmed an 08:00 arrival.', by: 'Transportes Garcia' },
        { time: '06:00 CEST', place: '-', label: 'Carrier Assigned',
          note: 'Assigned to Transportes Garcia de la Torre S.L.', by: 'Tom Jansen' },
      ] },
    ],
    warehouse: [
      { day: 'Thursday, 27 August 2026', events: [
        { time: '01:55 CEST', place: '080 01 Presov', label: 'Loaded',
          note: '18 pallets loaded at Dock 7. Seal 4471820 applied.',
          by: 'Operator Tom Jansen' },
      ] },
      { day: 'Wednesday, 26 August 2026', events: [
        { time: '23:40 CEST', place: '080 01 Presov', label: 'Truck Arrived',
          note: 'Truck checked in at Dock 7, 20 minutes ahead of the slot.',
          by: 'Operator Tom Jansen' },
        { time: '18:20 CEST', place: '080 01 Presov', label: 'Ready to Ship',
          note: 'Picking complete across 14 order lines. 7,420 kg staged.',
          by: 'Operator Bianca de Vries' },
      ] },
      { day: 'Monday, 17 August 2026', events: [
        { time: '08:04 CEST', place: '080 01 Presov', label: 'Registered',
          note: 'Outbound order received from the shipper.', by: 'System' },
      ] },
    ],
  };

  /*
   * ORDER ITEMS AND SHORTAGES — the two tables below Locations Info on a
   * warehouse order. Shape from Figma 29Ixi12L8wlQPTh3oVg0ao node 103:52832;
   * the values are invented.
   *
   * THE ROWS ARE BUILT FROM THE ORDER, not stored as one shared list.
   *
   * They used to be a fixed pair of lines, which meant General Information
   * derived "2 lines / 10 pallets" on an order whose own record says 14 and 18
   * — the page contradicting itself, and the paginator claiming two rows for
   * every warehouse order regardless of size. Now each order gets `o.lines`
   * rows whose palletsOrdered sum to exactly `o.pallets`, so the totals above
   * the table, the rows in it, and the order record all agree.
   *
   * Deterministic: the catalogue cycles by index, no randomness, so a re-render
   * produces the same table.
   */
  var ITEM_CATALOGUE = [
    { code: '10533', description: 'Onion Cubes 10x10SF Med-1x10kg - BP80',
      lot: 'L6071', bestBefore: 'Mon, 12 Mar 2028', tempClass: 'Frozen' },
    { code: '12070', description: 'Onion strips SF Med-1x10kg - bp70',
      lot: 'L6034', bestBefore: 'Mon, 03 Feb 2028', tempClass: 'Frozen' },
    { code: '10884', description: 'Leek Rings 10x10SF Med-1x10kg - BP80',
      lot: 'L6112', bestBefore: 'Thu, 27 Apr 2028', tempClass: 'Frozen' },
    { code: '11402', description: 'Carrot Cubes 10x10 Fine-1x10kg - BP60',
      lot: 'L5988', bestBefore: 'Sat, 15 Jan 2028', tempClass: 'Frozen' },
    { code: '13115', description: 'Pepper Mix Strips SF-1x10kg - bp70',
      lot: 'L6203', bestBefore: 'Wed, 09 Aug 2028', tempClass: 'Frozen' },
    { code: '10061', description: 'Spinach Leaf Whole-1x10kg - BP80',
      lot: 'L6047', bestBefore: 'Tue, 22 Feb 2028', tempClass: 'Frozen' },
  ];

  /* Pallets spread as evenly as the order's own total allows: one each, then
     the remainder over the first rows. Sums to o.pallets exactly. */
  function buildItems(o) {
    var n = o.lines || 0;
    if (!n) return [];
    var total = o.pallets || 0;
    var base = Math.floor(total / n);
    var extra = total - base * n;
    var rows = [];
    for (var i = 0; i < n; i++) {
      var cat = ITEM_CATALOGUE[i % ITEM_CATALOGUE.length];
      var pallets = base + (i < extra ? 1 : 0);
      var qty = pallets * 80;
      var pals = [];
      for (var k = 0; k < pallets; k++) {
        pals.push({
          sscc: String(388284 + i * 6 + k * 2),
          lot: cat.lot, bestBefore: cat.bestBefore,
          ordered: '80', shipped: '80', uom: 'CA', uomType: 'Default UoM',
          quality: '-', temperature: '- 37.2 °C',
          profileCheck: k === 0 ? '€ 543.00' : '€ 155.00',
        });
      }
      rows.push({
        line: String((i + 1) * 10).padStart(4, '0'),
        code: cat.code, description: cat.description,
        bestBefore: cat.bestBefore, lot: cat.lot, quality: '-',
        ordered: String(qty), shipped: String(qty),
        uom: 'CA', uomType: 'Default UoM', shortage: '-',
        palletsOrdered: String(pallets), palletsShipped: String(pallets),
        tempClass: cat.tempClass, pallets: pals,
      });
    }
    return rows;
  }

  var WAREHOUSE_SHORTAGES = [
    { line: '0010', code: '31029065', description: '8 St Limone XXL 88ml (X6) LIDL',
      quantity: '5' },
  ];

  var ORDER_DETAIL = {
    cargo: {
      kind: 'Pallet',
      estimatedTotalWeight: '3,500 kg',
      calculatedTotalWeight: '3,500 kg',
      estimatedValue: '€ 250,000.00',
      temperatureRange: '-25 °C to -18 °C',
      foodOrPerishable: 'Food',
      hazardous: 'No',
      goodsPalletised: 'All',
      loadingMethod: 'Door Loading',
      maxPallets: '10',
      maxPalletHeight: '-',
      description: 'Euro pallets',
    },
    pallet: {
      name: 'Euro-pallet (120 x 80 x 180)',
      quantity: '10',
      description: 'Euro pallets',
      weight: '350 kg',
      requestedExchange: '10/10',
      actualLoading: '10',
      actualUnloading: '10',
    },
    vehicle: {
      motor: { vehicle: 'Semi-tractor', plate: 'WGM4722K', truckNumber: '-' },
      trailer: { type: 'Trailer', bodyType: 'Curtainside', plate: '12', trailerNumber: '-' },
      driver: { name: 'Marek Nowak', phone: '+48 22 290 27 62' },
    },
    contacts: {
      operator: { initials: 'TJ', name: 'Tom Jansen', company: 'CtrlChain B.V.', flag: 'nl' },
      shipper: { initials: 'IM', name: 'Ingram Micro Booker', role: 'Booker',
                 email: 'booker@example.com' },
      carrierContact: { phone: '+48 22 290 27 62', email: 'planning@example.com' },
    },
    /* Route Details — the planner's own figures for the drawn route. */
    route: { avoid: '-', duration: '9h 24m', distance: '812 km', roadTaxes: '-', co2: '0 kg' },
    /* Requested Vehicle(s) — what was asked for, distinct from what turned up
       (which is Carrier & Vehicle Details). */
    requestedVehicle: {
      kind: 'Trailer', bodyType: 'Curtainside', tailLift: 'No',
      length: '1,360 cm', width: '245 cm', height: '265 cm', maxWeight: '24,000 kg',
    },
    bookedFrom: 'LANE2026-000231',
    /* Zero throughout, as an un-offset order reads on the real page. */
    co2: { contribution: '€0.00', offset: '0 t', water: '0 l', lives: '0 people',
           land: '0 m²', trees: '0 trees' },
    openingHours: [
      { day: 'Monday', hours: '06:00 - 18:00' },
      { day: 'Tuesday', hours: '06:00 - 18:00' },
      { day: 'Wednesday', hours: '06:00 - 18:00' },
      { day: 'Thursday', hours: '06:00 - 18:00' },
      { day: 'Friday', hours: '06:00 - 18:00' },
      { day: 'Saturday', hours: 'Closed' },
      { day: 'Sunday', hours: 'Closed' },
    ],
    locationType: 'Warehouse',
    totals: { weight: '3,500 kg', items: '10', exchangeNeeded: '10', actualExchange: 'n/a' },
  };

  /*
   * Legal documents — Admin › Legal
   * -------------------------------
   * Read off development.ctrlchain.com/admin/legal on 27 Aug 2026. The document
   * names and sales organisations are CtrlChain's own legal entities and product
   * content, so they are verbatim; the people and customer group names in the
   * signing history are replaced, because this repo publishes to GitHub Pages.
   *
   * `category` is which of the five tabs on the CTRLCHAIN segment a document
   * belongs to. `updatedAt` is null for a document nobody has published yet —
   * the app renders that as "To be confirmed" rather than a date.
   */
  var LEGAL_DOCUMENTS = [
    // ---- Shipper T&C (13) --------------------------------------------------
    { id: 'LEG-STC-FR',    category: 'shipper-tc', name: 'Terms & Conditions for Shippers in France',          status: 'Published', salesOrg: 'NewCold Transport Frozen SAS',        flag: 'fr', updatedAt: 'Tue, 30 Sept 2025', updatedTime: '14:35' },
    { id: 'LEG-STC-DE',    category: 'shipper-tc', name: 'Terms & Conditions for Shippers in Germany',         status: 'Published', salesOrg: 'CtrlChain GmbH',                     flag: 'de', updatedAt: 'Mon, 20 Jul 2026',  updatedTime: '13:08' },
    { id: 'LEG-STC-NCUS',  category: 'shipper-tc', name: 'Terms & Conditions for Shippers with NewCold USA',   status: 'Published', salesOrg: 'NewCold USA Transport LLC',          flag: 'us', updatedAt: 'Mon, 27 Jan 2025',  updatedTime: '10:48' },
    { id: 'LEG-STC-NL',    category: 'shipper-tc', name: 'Terms & Conditions for Shippers in Netherlands',     status: 'Published', salesOrg: 'CtrlChain B.V.',                     flag: 'nl', updatedAt: 'Mon, 20 Jul 2026',  updatedTime: '13:08' },
    { id: 'LEG-STC-NCEU',  category: 'shipper-tc', name: 'Terms & Conditions for Shippers with NewCold Pan EU', status: 'Published', salesOrg: 'NewCold Pan European B.V.',         flag: 'nl', updatedAt: 'Mon, 6 Jan 2025',   updatedTime: '10:49' },
    { id: 'LEG-STC-PL-D',  category: 'shipper-tc', name: 'Terms & Conditions for Shippers in Poland',          status: 'Draft',     salesOrg: 'NewCold Transport Poland Sp. z o.o.', flag: 'pl', updatedAt: 'Tue, 8 Jul 2025',   updatedTime: '12:43' },
    { id: 'LEG-STC-PL-E',  category: 'shipper-tc', name: 'Terms & Conditions for Shippers in Poland',          status: 'Published', salesOrg: 'NewCold Transport Poland Sp. z o.o. €', flag: 'pl', updatedAt: 'Thu, 27 Mar 2025', updatedTime: '11:42' },
    { id: 'LEG-STC-ES',    category: 'shipper-tc', name: 'Terms & Conditions for Shippers in Spain',           status: 'Published', salesOrg: 'CtrlChain España S.L.U',        flag: 'es', updatedAt: 'Mon, 20 Jul 2026',  updatedTime: '13:08' },
    { id: 'LEG-STC-UKX-E', category: 'shipper-tc', name: 'Terms & Conditions for Shippers in UK Crossborder',  status: 'New',       salesOrg: 'NewCold Wakefield Ltd Crossborder €', flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-STC-UKX-P', category: 'shipper-tc', name: 'Terms & Conditions for Shippers in UK Crossborder',  status: 'Published', salesOrg: 'NewCold Wakefield Ltd Crossborder £', flag: 'gb', updatedAt: 'Fri, 14 Aug 2026', updatedTime: '14:27' },
    { id: 'LEG-STC-UKD-E', category: 'shipper-tc', name: 'Terms & Conditions for Shippers in UK Domestic',     status: 'Published', salesOrg: 'NewCold Wakefield Ltd Domestic €',    flag: 'gb', updatedAt: 'Mon, 17 Aug 2026', updatedTime: '11:17' },
    { id: 'LEG-STC-UKD-P', category: 'shipper-tc', name: 'Terms & Conditions for Shippers in UK Domestic',     status: 'Published', salesOrg: 'NewCold Wakefield Ltd Domestic £',    flag: 'gb', updatedAt: 'Mon, 17 Aug 2026', updatedTime: '11:17' },
    { id: 'LEG-STC-US',    category: 'shipper-tc', name: 'Terms & Conditions for Shippers in USA',             status: 'Published', salesOrg: 'CtrlChain USA LLC',                  flag: 'us', updatedAt: 'Mon, 20 Jul 2026',  updatedTime: '13:07' },

    // ---- Carrier T&C (13) --------------------------------------------------
    { id: 'LEG-CTC-FR',    category: 'carrier-tc', name: 'Terms and conditions for carriers in France',            status: 'Published', salesOrg: 'NewCold Transport Frozen SAS',        flag: 'fr', updatedAt: 'Thu, 6 Mar 2025',   updatedTime: '16:36' },
    { id: 'LEG-CTC-DE',    category: 'carrier-tc', name: 'Terms & Conditions for Carriers in the Germany',         status: 'Published', salesOrg: 'CtrlChain GmbH',                     flag: 'de', updatedAt: 'Thu, 3 Oct 2024',   updatedTime: '09:13' },
    { id: 'LEG-CTC-NCUS',  category: 'carrier-tc', name: 'Terms and Conditions for Carriers with NewCold USA',     status: 'Published', salesOrg: 'NewCold USA Transport LLC',          flag: 'us', updatedAt: 'Tue, 28 Jan 2025',  updatedTime: '09:42' },
    { id: 'LEG-CTC-NL',    category: 'carrier-tc', name: 'Terms and conditions for carriers in Netherlands',       status: 'Published', salesOrg: 'CtrlChain B.V.',                     flag: 'nl', updatedAt: 'Thu, 3 Oct 2024',   updatedTime: '09:14' },
    { id: 'LEG-CTC-NCEU',  category: 'carrier-tc', name: 'Terms and Conditions for Carriers with NewCold Pan EU',  status: 'Published', salesOrg: 'NewCold Pan European B.V.',          flag: 'nl', updatedAt: 'Wed, 26 Aug 2026',  updatedTime: '10:12' },
    { id: 'LEG-CTC-PL',    category: 'carrier-tc', name: 'Terms and conditions for carriers in Poland',            status: 'Published', salesOrg: 'NewCold Transport Poland Sp. z o.o.', flag: 'pl', updatedAt: 'Thu, 14 Nov 2024',  updatedTime: '16:29' },
    { id: 'LEG-CTC-PL-E',  category: 'carrier-tc', name: 'Terms and conditions for carriers in Poland',            status: 'Published', salesOrg: 'NewCold Transport Poland Sp. z o.o. €', flag: 'pl', updatedAt: 'Thu, 6 Mar 2025', updatedTime: '16:36' },
    { id: 'LEG-CTC-ES',    category: 'carrier-tc', name: 'Terms & Conditions for Carriers in the Spain',           status: 'Published', salesOrg: 'CtrlChain España S.L.U',        flag: 'es', updatedAt: 'Thu, 26 Sept 2024', updatedTime: '09:14' },
    { id: 'LEG-CTC-UKX-E', category: 'carrier-tc', name: 'T&C_Carrier_UK_Crossborder_Euro [en-Untranslated]',      status: 'New',       salesOrg: 'NewCold Wakefield Ltd Crossborder €', flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-CTC-UKX-P', category: 'carrier-tc', name: 'T&C_Carrier_UK_Crossborder_Pound [en-Untranslated]',     status: 'New',       salesOrg: 'NewCold Wakefield Ltd Crossborder £', flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-CTC-UKD-E', category: 'carrier-tc', name: 'T&C_Carrier_UK_Domestic_Euro [en-Untranslated]',         status: 'New',       salesOrg: 'NewCold Wakefield Ltd Domestic €',    flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-CTC-UKD-P', category: 'carrier-tc', name: 'T&C_Carrier_UK_Domestic_Pound [en-Untranslated]',        status: 'New',       salesOrg: 'NewCold Wakefield Ltd Domestic £',    flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-CTC-US',    category: 'carrier-tc', name: 'Terms and conditions for carriers in USA',               status: 'Published', salesOrg: 'CtrlChain USA LLC',                  flag: 'us', updatedAt: 'Thu, 3 Oct 2024',   updatedTime: '09:16' },

    // ---- Terms of Service (1) — no Sales Organisation column on this tab ----
    { id: 'LEG-TOS-SYS',   category: 'terms-of-service', name: 'Term of Use for System User', status: 'Published', salesOrg: null, flag: null, updatedAt: 'Tue, 11 Aug 2026', updatedTime: '11:46' },

    // ---- Privacy Policies (2) — column present, values empty ---------------
    // `region` is the tab label on the reader page — the app shows EU / USA there
    // rather than the document's full name.
    { id: 'LEG-PP-EU',     category: 'privacy-policy', region: 'EU',  name: 'Privacy Policy Europe', status: 'Published', salesOrg: null, flag: null, updatedAt: 'Tue, 25 Aug 2026', updatedTime: '15:28' },
    { id: 'LEG-PP-US',     category: 'privacy-policy', region: 'USA', name: 'Privacy Policy US',     status: 'Draft',     salesOrg: null, flag: null, updatedAt: 'Fri, 10 Oct 2025', updatedTime: '10:55' },

    // ---- Invoicing Instruction (13) ----------------------------------------
    { id: 'LEG-II-DE',     category: 'invoicing-instruction', name: 'Invoicing Instructions CCA DE',                        status: 'Published', salesOrg: 'CtrlChain GmbH',                     flag: 'de', updatedAt: 'Tue, 20 May 2025', updatedTime: '09:53' },
    { id: 'LEG-II-ES',     category: 'invoicing-instruction', name: 'Invoicing Instructions CCA ES',                        status: 'Published', salesOrg: 'CtrlChain España S.L.U',        flag: 'es', updatedAt: 'Tue, 22 Apr 2025', updatedTime: '14:28' },
    { id: 'LEG-II-NL',     category: 'invoicing-instruction', name: 'Invoicing Instructions CCA NL',                        status: 'Published', salesOrg: 'CtrlChain B.V.',                     flag: 'nl', updatedAt: 'Fri, 25 Apr 2025', updatedTime: '11:40' },
    { id: 'LEG-II-US',     category: 'invoicing-instruction', name: 'Invoicing Instructions CCA US',                        status: 'Published', salesOrg: 'CtrlChain USA LLC',                  flag: 'us', updatedAt: 'Tue, 22 Apr 2025', updatedTime: '14:29' },
    { id: 'LEG-II-NCFR',   category: 'invoicing-instruction', name: 'Invoicing Instructions NewCold France',                status: 'Published', salesOrg: 'NewCold Transport Frozen SAS',       flag: 'fr', updatedAt: 'Mon, 5 May 2025',  updatedTime: '12:17' },
    { id: 'LEG-II-NCEU',   category: 'invoicing-instruction', name: 'Invoicing Instructions NewCold PAN EU',                status: 'Published', salesOrg: 'NewCold Pan European B.V.',          flag: 'nl', updatedAt: 'Tue, 22 Apr 2025', updatedTime: '14:29' },
    { id: 'LEG-II-NCPL',   category: 'invoicing-instruction', name: 'Invoicing Instructions NewCold Poland',                status: 'Published', salesOrg: 'NewCold Transport Poland Sp. z o.o.', flag: 'pl', updatedAt: 'Mon, 5 May 2025', updatedTime: '11:52' },
    { id: 'LEG-II-NCPL-E', category: 'invoicing-instruction', name: 'Invoicing Instructions NewCold Poland Sp. z o.o. €', status: 'Published', salesOrg: 'NewCold Transport Poland Sp. z o.o. €', flag: 'pl', updatedAt: 'Wed, 7 May 2025', updatedTime: '14:37' },
    { id: 'LEG-II-UKX-E',  category: 'invoicing-instruction', name: 'InvoicingInstruction_NC_UK_Crossborder_EUR [en-Untranslated]', status: 'New', salesOrg: 'NewCold Wakefield Ltd Crossborder €', flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-II-UKX-P',  category: 'invoicing-instruction', name: 'InvoicingInstruction_NC_UK_Crossborder_GBP [en-Untranslated]', status: 'New', salesOrg: 'NewCold Wakefield Ltd Crossborder £', flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-II-UKD-E',  category: 'invoicing-instruction', name: 'InvoicingInstruction_NC_UK_Domestic_EUR [en-Untranslated]',    status: 'New', salesOrg: 'NewCold Wakefield Ltd Domestic €',    flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-II-UKD-P',  category: 'invoicing-instruction', name: 'InvoicingInstruction_NC_UK_Domestic_GBP [en-Untranslated]',    status: 'New', salesOrg: 'NewCold Wakefield Ltd Domestic £',    flag: 'gb', updatedAt: null, updatedTime: null },
    { id: 'LEG-II-NCUS',   category: 'invoicing-instruction', name: 'Invoicing Instructions NewCold US',                    status: 'Published', salesOrg: 'NewCold USA Transport LLC',          flag: 'us', updatedAt: 'Mon, 5 May 2025', updatedTime: '12:00' },
  ];

  /*
   * Version history.
   *
   * A legal document is a container; the text lives in versions, and only one is
   * live at a time. The app's version dropdown lists them newest first, with the
   * current one Published (or Draft) and every superseded one Substituted — that
   * word is the platform's, not a synonym someone picked here.
   *
   * A document with status New has NO versions at all, which is why its detail
   * page is an empty state rather than a blank body.
   *
   * The text-or-file split matters beyond the admin page. The platform has
   * reader-facing pages for these documents — /privacy-policy/<id> and
   * /terms-of-service, reached from the account menu — which show the live
   * version only, with no version picker and no actions. What they render is the
   * rich text or the PDF depending on which of the two that version is, so
   * anything reading these records for a reader has to handle both.
   *
   * These are derived rather than hand-written for all 42 documents. France is
   * the exception: it carries the ten versions the running app actually shows,
   * because it is the row people click first.
   */
  var VERSION_OVERRIDES = {
    'LEG-STC-FR': [
      { v: '3.3', status: 'Published' },
      { v: '3.2', status: 'Substituted' },
      { v: '3.1', status: 'Substituted' },
      { v: '3.0', status: 'Substituted' },
      { v: '2.3', status: 'Substituted' },
      { v: '2.2', status: 'Substituted' },
      { v: '2.1', status: 'Substituted' },
      { v: '2.0', status: 'Substituted' },
      { v: '1.1', status: 'Substituted' },
      { v: '1.0', status: 'Substituted' },
    ],
  };

  function versionsFor(doc) {
    if (VERSION_OVERRIDES[doc.id]) return VERSION_OVERRIDES[doc.id];
    // Never published, never drafted: nothing to show.
    if (doc.status === 'New') return [];
    /*
     * A Draft sits ON TOP of a published version — that is what the app shows:
     * the Poland document lists "1.1 Draft" then "1.0 Published". The list's
     * status is the NEWEST version's; the live one underneath is still what a
     * reader gets. Modelling a draft as the only version was wrong and made the
     * reader pages think the document had never been published.
     */
    if (doc.status === 'Draft') {
      return [
        { v: '1.1', status: 'Draft' },
        { v: '1.0', status: 'Published' },
      ];
    }
    // Published: the live one plus the two it replaced.
    return [
      { v: '2.1', status: 'Published' },
      { v: '2.0', status: 'Substituted' },
      { v: '1.0', status: 'Substituted' },
    ];
  }

  /*
   * "Updated by" on the detail page. The app shows the admin who last touched the
   * version; a published prototype should not carry a real colleague's name, so
   * this is a stand-in.
   */
  var LEGAL_EDITOR = 'Robin admin';

  LEGAL_DOCUMENTS.forEach(function (doc) {
    doc.versions = versionsFor(doc);
    doc.updatedBy = doc.versions.length ? LEGAL_EDITOR : null;
  });

  /*
   * One document is an UPLOADED PDF rather than written text.
   *
   * Both are real states — some terms are drafted in the editor, some arrive as
   * a file from legal counsel — and the detail page renders them differently.
   * Without one of each in the fixture, the uploaded branch is only reachable by
   * a reviewer finding a PDF on their own machine and dragging it in, which
   * nobody does. So this one ships with a document attached.
   *
   * The PDF is generated, not borrowed: it holds the same terms the other
   * documents show as rich text, so the preview shows something worth reading.
   * `path` is resolved against the prototype's root by the page, since a fixture
   * cannot know how deep the page that reads it sits.
   */
  var UPLOADED =
    window.CCA_DATA_ROOT ||
    (document.documentElement.getAttribute('data-root') || '../') + '_shared/assets/sample-terms.pdf';
  LEGAL_DOCUMENTS.filter(function (doc) { return doc.id === 'LEG-STC-NCUS'; }).forEach(function (doc) {
    doc.versions[0].file = { name: 'TC-Shippers-NewCold-USA.pdf', type: 'application/pdf', url: UPLOADED };
  });

  /*
   * Shipper-specific terms — the SHIPPER'S segment. One document per shipper
   * group, provided by that group rather than by a CtrlChain sales organisation,
   * which is why this table has "Provided by" where the platform table has
   * "Sales Organisation" and no flag. 19 rows on development.
   */
  var LEGAL_SHIPPER_TERMS = [
    { id: 'LEG-SH-01', name: "T&C for ! Aurora's Shipper Enterprise", status: 'Published', providedBy: "! Aurora's Shipper Enterprise", updatedAt: 'Mon, 22 Jun 2026',  updatedTime: '09:02' },
    { id: 'LEG-SH-02', name: 'T&C for --> DemoMt',                    status: 'Published', providedBy: '--> DemoMt',                    updatedAt: 'Thu, 10 Apr 2025',  updatedTime: '09:41' },
    { id: 'LEG-SH-03', name: 'T&C for Dev Test1',                     status: 'Published', providedBy: 'Dev Test1NEW',                  updatedAt: 'Tue, 15 Apr 2025',  updatedTime: '10:41' },
    { id: 'LEG-SH-04', name: 'T&C for SaaS2',                         status: 'Published', providedBy: 'SaaS2',                         updatedAt: 'Wed, 21 May 2025',  updatedTime: '12:17' },
    { id: 'LEG-SH-05', name: 'T&C for MT Shipper',                    status: 'Published', providedBy: 'MT Shipper',                    updatedAt: 'Wed, 31 Dec 2025',  updatedTime: '13:30' },
    { id: 'LEG-SH-06', name: 'T&C for g250226',                       status: 'Published', providedBy: 'g250226',                       updatedAt: 'Fri, 11 Apr 2025',  updatedTime: '12:45' },
    { id: 'LEG-SH-07', name: 'T&C for g250313',                       status: 'Published', providedBy: 'g250313',                       updatedAt: 'Tue, 15 Apr 2025',  updatedTime: '11:06' },
    { id: 'LEG-SH-08', name: 'T&C for g2503171332',                   status: 'Published', providedBy: 'g2503171332',                   updatedAt: 'Fri, 11 Apr 2025',  updatedTime: '12:31' },
    { id: 'LEG-SH-09', name: 'T&C for ShipperSaasBasic',              status: 'Published', providedBy: 'ShipperSaasBasic',              updatedAt: 'Mon, 20 Apr 2026',  updatedTime: '14:59' },
    { id: 'LEG-SH-10', name: 'T&C for NordicShippersGroup',           status: 'Published', providedBy: 'NordicShippersGroup',           updatedAt: 'Mon, 4 Aug 2025',   updatedTime: '12:59' },
    { id: 'LEG-SH-11', name: 'T&C for NordicTest',                    status: 'Published', providedBy: 'NordicTest',                    updatedAt: 'Sun, 4 May 2025',   updatedTime: '21:28' },
    { id: 'LEG-SH-12', name: 'T&C for MS Transport Shipper',          status: 'Published', providedBy: 'MS Transport Shipper',          updatedAt: 'Mon, 9 Jun 2025',   updatedTime: '12:43' },
    { id: 'LEG-SH-13', name: 'T&C for mt230201',                      status: 'Published', providedBy: 'mt230201',                      updatedAt: 'Fri, 7 Aug 2026',   updatedTime: '12:55' },
    { id: 'LEG-SH-14', name: 'T&C for Valdera Fruits',                status: 'Published', providedBy: 'Valdera Fruits',                updatedAt: 'Tue, 27 May 2025',  updatedTime: '10:24' },
    { id: 'LEG-SH-15', name: 'T&C for saas.e',                        status: 'Published', providedBy: 'saas.e',                        updatedAt: 'Mon, 20 Jul 2026',  updatedTime: '13:56' },
    { id: 'LEG-SH-16', name: 'T&C for SaaSShiper',                    status: 'Published', providedBy: 'SaaSShiper',                    updatedAt: 'Thu, 12 Jun 2025',  updatedTime: '11:53' },
    { id: 'LEG-SH-17', name: 'T&C for ShipperGroup01_MT_BT (do not touch)', status: 'Published', providedBy: 'ShipperGroup01_MT_BT_ES (do not touch)', updatedAt: 'Thu, 8 Jan 2026', updatedTime: '09:18' },
    { id: 'LEG-SH-18', name: 'T&C for ShipperGroup07_BT_SaaS (do not touch)', status: 'Published', providedBy: 'ShipperGroup07_BT_SaaS (do not touch)', updatedAt: 'Thu, 8 Jan 2026', updatedTime: '09:26' },
    { id: 'LEG-SH-19', name: 'T&C for Test group by Ravi',            status: 'Published', providedBy: 'Test group by Ravi',            updatedAt: 'Fri, 2 Jan 2026',   updatedTime: '14:07' },
  ];

  /*
   * Signing history — every acceptance of a legal document, newest first. The
   * real table holds 175,520 rows, which is the number the paginator reports;
   * `signingsTotal` records that so a prototype can show the real magnitude
   * without shipping 175,520 objects. `group` is two lines in the app: the
   * shipper group above, the sub-group below.
   */
  var LEGAL_SIGNINGS = [
    { id: 'SIGN-0001', group: 'CtrlChain',                subGroup: null,                          user: 'systemuser_412',                                signedOn: 'Term of Use for System User',                 version: 'v13.2', providedBy: null,             flag: null, signedAt: 'Thu, 27 Aug 2026', signedTime: '16:43' },
    { id: 'SIGN-0002', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__117990ab1b3f3a63125111d186eeed49', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:37' },
    { id: 'SIGN-0003', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__117990ab1b3f3a63125111d186eeed49', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:36' },
    { id: 'SIGN-0004', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__5e3c1c6e2f148fc2cc10e3a5b66e34f2', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:36' },
    { id: 'SIGN-0005', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__117990ab1b3f3a63125111d186eeed49', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:35' },
    { id: 'SIGN-0006', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__ca68000dfc5f1da4f556e0c79ca3f22f', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:35' },
    // A user deleted after signing: the group cell empties but the record stays.
    { id: 'SIGN-0007', group: null,                       subGroup: null,                          user: 'USER HARD DELETED',                             signedOn: 'Term of Use for System User',                 version: 'v13.2', providedBy: null,             flag: null, signedAt: 'Thu, 27 Aug 2026', signedTime: '16:34' },
    { id: 'SIGN-0008', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__8eb3bfe2832f1f9c428ec2eda5371dc4', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:34' },
    { id: 'SIGN-0009', group: null,                       subGroup: null,                          user: 'USER HARD DELETED',                             signedOn: 'Term of Use for System User',                 version: 'v13.2', providedBy: null,             flag: null, signedAt: 'Thu, 27 Aug 2026', signedTime: '16:34' },
    { id: 'SIGN-0010', group: 'AUTOMATION_STATIC_SHIPPER_1_NL', subGroup: 'AUTOMATION_STATIC_SHIPPER_1_NL', user: 'user__3c07a1be4f2d9b7e5a0c8412d6ff1e93', signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:33' },
    { id: 'SIGN-0011', group: 'CtrlChain',                subGroup: null,                          user: 'systemuser_318',                                signedOn: 'Term of Use for System User',                 version: 'v13.2', providedBy: null,             flag: null, signedAt: 'Thu, 27 Aug 2026', signedTime: '16:31' },
    { id: 'SIGN-0012', group: 'NordicShippersGroup',      subGroup: 'NordicShippersGroup NL',      user: 'user__b91d7fc0a3e54862bb2f11d7c8043a5e',        signedOn: 'Terms & Conditions for Shippers in Netherlands', version: 'v6.1', providedBy: 'CtrlChain B.V.', flag: 'nl', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:28' },
    { id: 'SIGN-0013', group: 'MS Transport Shipper',     subGroup: 'MS Transport Shipper DE',     user: 'user__47ac2e91f6b840d5a1c93e07b25d6f81',        signedOn: 'Terms & Conditions for Shippers in Germany',     version: 'v4.3', providedBy: 'CtrlChain GmbH', flag: 'de', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:22' },
    { id: 'SIGN-0014', group: 'Valdera Fruits',           subGroup: 'Valdera Fruits ES',           user: 'user__0d5b8e73c1a24f9682ee45103bd7a6c2',        signedOn: 'Terms & Conditions for Shippers in Spain',       version: 'v3.0', providedBy: 'CtrlChain España S.L.U', flag: 'es', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:19' },
    { id: 'SIGN-0015', group: 'MT Shipper',               subGroup: 'MT Shipper FR',               user: 'user__ee1904ba7d3c46f090b5c72a8de13f47',        signedOn: 'Terms & Conditions for Shippers in France',      version: 'v9.2', providedBy: 'NewCold Transport Frozen SAS', flag: 'fr', signedAt: 'Thu, 27 Aug 2026', signedTime: '16:11' },
  ];

  var LEGAL_SIGNINGS_TOTAL = 175520;

  /*
   * The text of a written document.
   *
   * Here rather than in a page because two screens render it: the admin's
   * version manager and the reader-facing pages. Kept in one place so they
   * cannot disagree about what a document says.
   *
   * Obviously fake, plausibly shaped. Real terms run to thousands of words and
   * the ones on development are full of half-finished editor notes; neither
   * belongs in a prototype that gets published. This is short, has the shapes a
   * reviewer needs to see — headings, paragraphs, both list types — and says
   * what it is.
   */
  function legalBody(doc) {
    var org = doc.salesOrg || 'CtrlChain';

    if (doc.category === 'privacy-policy') {
      return [
        '<h3>1. Who we are</h3>',
        '<p>' + org + ' is the data controller for the personal data described in this ' +
          'policy. For any question about it, or to exercise a right below, contact our ' +
          'data protection officer.</p>',
        '<h3>2. What we collect</h3>',
        '<p>We process the data you give us and the data your use of the platform ' +
          'generates:</p>',
        '<ul>',
        '<li>account details — name, work email, telephone number;</li>',
        '<li>transport records — the orders, addresses and documents you handle;</li>',
        '<li>technical data — sign-in times, IP address, and the pages you open.</li>',
        '</ul>',
        '<h3>3. Why we process it</h3>',
        '<ol>',
        '<li>To perform the agreement under which you use the platform.</li>',
        '<li>To meet legal obligations, including tax and customs record-keeping.</li>',
        '<li>For our legitimate interest in keeping the platform secure and working.</li>',
        '</ol>',
        '<h3>4. Your rights</h3>',
        '<p>You may ask for a copy of your data, ask us to correct it, ask us to erase ' +
          'it where we have no further need of it, and object to processing based on ' +
          'legitimate interest. You may also complain to your national supervisory ' +
          'authority.</p>',
        '<h3>5. How long we keep it</h3>',
        '<p>Transport records are kept for seven years to meet statutory retention ' +
          'periods. Account data is erased when the account closes.</p>',
      ].join('');
    }

    if (doc.category === 'terms-of-service') {
      return [
        '<h3>1. Applicability</h3>',
        '<p>These Terms of Use apply to every user of the CtrlChain system, and to all ' +
          'acts relating to its use, insofar as they are not subject to imperative law.</p>',
        '<h3>2. Account registration</h3>',
        '<ol>',
        '<li>A user registers an account before being granted access to the system.</li>',
        '<li>The user is responsible for keeping their credentials secret.</li>',
        '<li>The user must inform CtrlChain without delay of any unauthorised use.</li>',
        '</ol>',
        '<h3>3. Use of the system</h3>',
        '<p>The user shall use the system in accordance with these terms and applicable ' +
          'regulations, and only for the purposes for which it is provided. CtrlChain may ' +
          'suspend access where these terms are breached.</p>',
        '<h3>4. Intellectual property</h3>',
        '<p>The system and everything in it remain the property of CtrlChain or its ' +
          'licensors. Nothing in these terms transfers any right in it to the user.</p>',
        '<h3>5. Governing law</h3>',
        '<p>These terms are governed by Dutch law, and the courts of Amsterdam have ' +
          'exclusive jurisdiction over any dispute arising from them.</p>',
      ].join('');
    }

    // Shipper and carrier terms, and invoicing instructions.
    var party = doc.category === 'carrier-tc' ? 'Carrier' : 'Shipper';
    return [
      '<h3>1. Definitions</h3>',
      '<p>In these terms, “Carrier” means the party undertaking carriage of the goods, ' +
        '“Shipper” means the party tendering them, and “Platform” means the CtrlChain ' +
        'services operated by ' + org + '.</p>',
      '<h3>2. Scope</h3>',
      '<p>These terms apply to every transport order placed through the Platform, and ' +
        'take precedence over any conflicting terms on a purchase order or ' +
        'acknowledgement unless agreed in writing.</p>',
      '<ol>',
      '<li>Orders are accepted subject to available capacity.</li>',
      '<li>Rates quoted exclude duties and levies unless stated.</li>',
      '<li>Cancellation within 24 hours of the pickup window may incur a charge.</li>',
      '</ol>',
      '<h3>3. Liability</h3>',
      '<p>Liability for loss of or damage to goods is limited in accordance with the ' +
        'applicable convention, and in no event covers:</p>',
      '<ul>',
      '<li>indirect or consequential loss, including loss of profit;</li>',
      '<li>delay, except where separately agreed in writing;</li>',
      '<li>goods carried at the ' + party + '’s declared risk.</li>',
      '</ul>',
      '<h3>4. Governing law</h3>',
      '<p>These terms are governed by the law of the country in which the contracting ' +
        'sales organisation is established, and the courts of that country have ' +
        'exclusive jurisdiction.</p>',
    ].join('');
  }

  window.CCA_DATA = {
    orders: ORDERS,
    order: function (id) {
      return ORDERS.filter(function (o) { return o.id === id; })[0] || null;
    },

    /*
     * Warehouse orders, and the two combined.
     *
     * `orders` stays transport-only so existing prototypes are unaffected;
     * `allOrders()` is what a combined list asks for. `order()` looks in both,
     * because a link carries an id and the receiving page should not have to
     * know which domain that id belongs to.
     */
    warehouseOrders: WAREHOUSE_ORDERS,
    invoiceOrders: INVOICE_ORDERS,
    allOrders: function () {
      return ORDERS.concat(WAREHOUSE_ORDERS, INVOICE_ORDERS);
    },
    anyOrder: function (id) {
      return ORDERS.concat(WAREHOUSE_ORDERS, INVOICE_ORDERS)
        .filter(function (o) { return o.id === id; })[0] || null;
    },
    /*
     * An order plus everything a detail page needs. The shared ORDER_DETAIL
     * block is the same for every order — fixture data, not a claim that real
     * orders share a cargo manifest.
     */
    /* The two warehouse tables below Locations Info. */
    orderItems: function (o) { return buildItems(o || {}); },
    shortages: function () { return WAREHOUSE_SHORTAGES; },

    /* The Shipment updates drawer's events, by domain. */
    timeline: function (o) {
      return TIMELINE[o && o.domain === 'warehouse' ? 'warehouse' : 'transport'];
    },

    orderDetail: function (id) {
      var o = ORDERS.concat(WAREHOUSE_ORDERS, INVOICE_ORDERS)
        .filter(function (r) { return r.id === id; })[0];
      if (!o) return null;
      var out = { detail: ORDER_DETAIL };
      Object.keys(o).forEach(function (k) { out[k] = o[k]; });
      return out;
    },

    /* The counterpart records `linked` points at, resolved. */
    linkedOrders: function (o) {
      return (o && o.linked ? o.linked : []).map(function (id) {
        return ORDERS.concat(WAREHOUSE_ORDERS, INVOICE_ORDERS)
          .filter(function (r) { return r.id === id; })[0] || { id: id };
      });
    },

    legalDocuments: LEGAL_DOCUMENTS,
    legalDocument: function (id) {
      return LEGAL_DOCUMENTS.filter(function (d) { return d.id === id; })[0] || null;
    },
    legalDocumentsIn: function (category) {
      return LEGAL_DOCUMENTS.filter(function (d) { return d.category === category; });
    },
    /*
     * The LIVE version — the one a reader is shown. Never a draft, never a
     * superseded one. Returns null for a document that has never been published,
     * which a reader page has to handle rather than render nothing.
     */
    legalBody: legalBody,
    legalLiveVersion: function (doc) {
      if (!doc || !doc.versions) return null;
      return doc.versions.filter(function (v) { return v.status === 'Published'; })[0] || null;
    },
    legalShipperTerms: LEGAL_SHIPPER_TERMS,
    legalSignings: LEGAL_SIGNINGS,
    legalSigningsTotal: LEGAL_SIGNINGS_TOTAL,
  };
})();

