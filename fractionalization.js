/**
 * ============================================================
 * HAGIMI Fractional Ownership Core V1
 * ============================================================
 *
 * Prototype only.
 *
 * This module models economic units and allocations.
 * It does NOT execute payments, securities transactions,
 * custody, settlement, or regulated transfers.
 * ============================================================
 */

const HAGIMI_LEDGER_KEY =
  "hagimi_fractional_ledger_v1";


function roundMoney(value) {
  return Math.round(
    Number(value) * 100
  ) / 100;
}


function createAllocationId() {
  return (
    "HAG-ALLOC-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()
  );
}


function readLedger() {
  try {
    const raw =
      localStorage.getItem(
        HAGIMI_LEDGER_KEY
      );

    const parsed =
      raw
        ? JSON.parse(raw)
        : [];

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}


function writeLedger(ledger) {
  localStorage.setItem(
    HAGIMI_LEDGER_KEY,
    JSON.stringify(
      ledger,
      null,
      2
    )
  );
}


function getProjectUnitPrice(project) {
  if (
    !project ||
    !Number.isFinite(
      Number(project.totalValue)
    ) ||
    !Number.isFinite(
      Number(project.totalUnits)
    ) ||
    Number(project.totalUnits) <= 0
  ) {
    return null;
  }

  return roundMoney(
    Number(project.totalValue) /
    Number(project.totalUnits)
  );
}


function getProjectAllocations(
  projectId
) {
  return readLedger().filter(
    entry =>
      entry.asset_id ===
      projectId &&
      entry.status ===
      "allocated"
  );
}


function getAllocatedUnits(
  projectId
) {
  return getProjectAllocations(
    projectId
  ).reduce(
    (sum, entry) =>
      sum +
      Number(entry.units || 0),
    0
  );
}


function getAvailableUnits(
  project
) {
  const totalUnits =
    Number(
      project?.totalUnits || 0
    );

  const allocated =
    getAllocatedUnits(
      project?.id
    );

  return Math.max(
    0,
    totalUnits - allocated
  );
}


function allocateUnits({
  project,
  investorId,
  investorName = null,
  units
}) {
  if (
    !project ||
    !project.id
  ) {
    throw new Error(
      "Invalid asset."
    );
  }

  const requestedUnits =
    Number(units);

  if (
    !Number.isInteger(
      requestedUnits
    ) ||
    requestedUnits <= 0
  ) {
    throw new Error(
      "Units must be a positive integer."
    );
  }

  const availableUnits =
    getAvailableUnits(
      project
    );

  if (
    requestedUnits >
    availableUnits
  ) {
    throw new Error(
      "Requested units exceed available supply."
    );
  }

  const unitPrice =
    getProjectUnitPrice(
      project
    );

  if (
    unitPrice === null
  ) {
    throw new Error(
      "Unable to determine unit price."
    );
  }

  const allocation = {
    allocation_id:
      createAllocationId(),

    investor_id:
      String(
        investorId ||
        "DEMO-INVESTOR"
      ),

    investor_name:
      investorName
        ? String(investorName)
        : null,

    asset_id:
      project.id,

    asset_name:
      project.name,

    units:
      requestedUnits,

    unit_price_gbp:
      unitPrice,

    gross_value_gbp:
      roundMoney(
        requestedUnits *
        unitPrice
      ),

    status:
      "allocated",

    timestamp:
      new Date()
        .toISOString()
  };

  const ledger =
    readLedger();

  ledger.push(
    allocation
  );

  writeLedger(
    ledger
  );

  return allocation;
}


function getInvestorPortfolio(
  investorId
) {
  const ledger =
    readLedger();

  const allocations =
    ledger.filter(
      entry =>
        entry.investor_id ===
        investorId &&
        entry.status ===
        "allocated"
    );

  const holdings = {};

  for (
    const allocation
    of allocations
  ) {
    if (
      !holdings[
        allocation.asset_id
      ]
    ) {
      holdings[
        allocation.asset_id
      ] = {
        asset_id:
          allocation.asset_id,

        asset_name:
          allocation.asset_name,

        units:
          0,

        invested_gbp:
          0
      };
    }

    holdings[
      allocation.asset_id
    ].units +=
      Number(
        allocation.units
      );

    holdings[
      allocation.asset_id
    ].invested_gbp =
      roundMoney(
        holdings[
          allocation.asset_id
        ].invested_gbp +
        Number(
          allocation
            .gross_value_gbp
        )
      );
  }

  return Object.values(
    holdings
  );
}


function resetDemoLedger() {
  localStorage.removeItem(
    HAGIMI_LEDGER_KEY
  );
}


window.HagimiFractionalization = {
  readLedger,
  getProjectUnitPrice,
  getProjectAllocations,
  getAllocatedUnits,
  getAvailableUnits,
  allocateUnits,
  getInvestorPortfolio,
  resetDemoLedger
};
