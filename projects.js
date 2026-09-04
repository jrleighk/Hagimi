const projects = [
  {
    id: "mac1990",
    name: "Macallan 1990 Cask",
    shortName: "Macallan 1990",
    type: "Cask",
    distillery: "Macallan",
    vintage: "1990",
    caskType: "Sherry Cask",
    abv: "51.5%",
    estimatedBottles: 285,
    targetMarket: "Hong Kong / Mainland China",
    totalValue: 327750,

    // Fractional Ownership V1
    totalUnits: 10000,
    initialUnitPrice: 32.775,
    assetStatus: "open",
    custodyStatus: "verified",
    ownershipStructure: "economic_units",

    // Legacy demo compatibility
    tokenSupply: 327750,
    sold: 120000,
    suitabilityScore: 8.7,
    suitabilityLabel: "Highly Suitable",
    story: "Rare long-aged sherry cask with strong collector appeal and high narrative value for Asian buyers."
  },
  {
    id: "mortlach1987",
    name: "Mortlach 1987 Cask",
    shortName: "Mortlach 1987",
    type: "Cask",
    distillery: "Mortlach",
    vintage: "1987",
    caskType: "Sherry Cask",
    abv: "50.8%",
    estimatedBottles: 190,
    targetMarket: "Mainland China / Hong Kong",
    totalValue: 228000,

    // Fractional Ownership V1
    totalUnits: 10000,
    initialUnitPrice: 22.80,
    assetStatus: "open",
    custodyStatus: "verified",
    ownershipStructure: "economic_units",

    // Legacy demo compatibility
    tokenSupply: 228000,
    sold: 64000,
    suitabilityScore: 7.9,
    suitabilityLabel: "Highly Suitable",
    story: "Old-school Mortlach profile with strong scarcity appeal, suitable for private collectors and premium gifting."
  },
  {
    id: "hp1996",
    name: "Highland Park 1996 Cask",
    shortName: "Highland Park 1996",
    type: "Cask",
    distillery: "Highland Park",
    vintage: "1996",
    caskType: "Refill Sherry",
    abv: "49.2%",
    estimatedBottles: 210,
    targetMarket: "Japan / Hong Kong / Singapore",
    totalValue: 168000,

    // Fractional Ownership V1
    totalUnits: 10000,
    initialUnitPrice: 16.80,
    assetStatus: "open",
    custodyStatus: "verified",
    ownershipStructure: "economic_units",

    // Legacy demo compatibility
    tokenSupply: 168000,
    sold: 42000,
    suitabilityScore: 7.1,
    suitabilityLabel: "Moderately Suitable",
    story: "Balanced age and brand recognition with flexible positioning for collectors and premium retail channels."
  }
];

function getProjectById(id) {
  return projects.find(project => project.id === id) || projects[0];
}

function formatCurrencyGBP(value) {
  return "£" + Number(value).toLocaleString();
}

function calculateTokenPrice(project) {
  const percentSold = project.sold / project.tokenSupply;
  return 1 + percentSold * 0.6;
}

function getAllocationLink(projectId) {
  return `allocation.html?project=${encodeURIComponent(projectId)}`;
}
