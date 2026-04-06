export const SURGE_IDENTITY_ADDRESS = "0xd0056f2aa729a2b9e8da9cd1d893bd4d8bf3af26" as const;
export const SURGE_SCORE_ADDRESS = "0x27a4381ef8c9184fa82e7d13af96f562bcfe213b" as const;

export const surgeIdentityAbi = [
  {
    type: "function",
    name: "mint",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "identityOf",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "joinPosition",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "IdentityMinted",
    inputs: [
      { name: "to", type: "address", indexed: true, internalType: "address" },
      { name: "tokenId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "position", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyMinted",
    inputs: [],
  },
  {
    type: "error",
    name: "Soulbound",
    inputs: [],
  },
] as const;

export const surgeScoreAbi = [
  {
    type: "function",
    name: "scoreOfAddress",
    inputs: [{ name: "wallet", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "scoreOf",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const SURGE_ATTESTATION_ADDRESS = "0xff56358a8303060d117003ea1d6b0328af4615fa" as const;
export const SURGE_BADGE_ADDRESS = "0x9907bbe59b454aaf0a48b9346e34628081c4c107" as const;

export const surgeAttestationAbi = [
  {
    type: "function",
    name: "attest",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "schemaId", type: "bytes32", internalType: "bytes32" },
      { name: "scoreAmount", type: "uint256", internalType: "uint256" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "attestationCount",
    inputs: [
      { name: "wallet", type: "address", internalType: "address" },
      { name: "schemaId", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAttestation",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct SurgeAttestation.Attestation",
        components: [
          { name: "tokenId", type: "uint256", internalType: "uint256" },
          { name: "attester", type: "address", internalType: "address" },
          { name: "schemaId", type: "bytes32", internalType: "bytes32" },
          { name: "issuedAt", type: "uint64", internalType: "uint64" },
          { name: "scoreAwarded", type: "uint256", internalType: "uint256" },
          { name: "data", type: "bytes", internalType: "bytes" },
          { name: "revoked", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "attestationsByToken",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "attestationsBySchema",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes32", internalType: "bytes32" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "attestations",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "attester", type: "address", internalType: "address" },
      { name: "schemaId", type: "bytes32", internalType: "bytes32" },
      { name: "issuedAt", type: "uint64", internalType: "uint64" },
      { name: "scoreAwarded", type: "uint256", internalType: "uint256" },
      { name: "data", type: "bytes", internalType: "bytes" },
      { name: "revoked", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "IDENTITY",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract SurgeIdentity" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SCORE",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract SurgeScore" }],
    stateMutability: "view",
  },
] as const;

export const surgeBadgeAbi = [
  {
    type: "function",
    name: "claim",
    inputs: [{ name: "badgeId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "canClaim",
    inputs: [
      { name: "wallet", type: "address", internalType: "address" },
      { name: "badgeId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createBadge",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "scoreThreshold", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "badgeId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "badgeTypes",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "scoreThreshold", type: "uint256", internalType: "uint256" },
      { name: "exists", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "badgeCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasClaimed",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "IDENTITY",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract SurgeIdentity" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "SCORE",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract SurgeScore" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BadgeCreated",
    inputs: [
      { name: "badgeId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      { name: "scoreThreshold", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BadgeClaimed",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "badgeId", type: "uint256", indexed: true, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;
