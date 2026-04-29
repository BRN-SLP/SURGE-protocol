// ── Per-chain contract addresses (v2 — ERC-1155 UUPS rebuild) ─────────────────
// To add a new chain: add ONE entry here. Nowhere else.

export interface ChainAddresses {
  identity: `0x${string}`;
  score: `0x${string}`;
  attestation: `0x${string}`;
  badge: `0x${string}`;
}

export const CHAIN_REGISTRY: Record<number, ChainAddresses> = {
  84532: {
    // Base Sepolia
    identity: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    score: "0x2c6DF1C6D80F1a150C89540DAA8c14e44f7AEd33",
    attestation: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
    badge: "0x3f694EB36609Cc52f0cBb9Beda3Df1B361A4B457",
  },
  11155420: {
    // OP Sepolia
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0xCa19812430a7Fe5F800066D102A22EA6279fD856",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  1301: {
    // Unichain Sepolia
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0xCa19812430a7Fe5F800066D102A22EA6279fD856",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  4202: {
    // Lisk Sepolia
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0x1202e902E1E7c6fe03a0C6a1bc88Ec816EDaeC15",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  4801: {
    // Worldchain Sepolia
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0xCa19812430a7Fe5F800066D102A22EA6279fD856",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  763373: {
    // Ink Sepolia
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0xCa19812430a7Fe5F800066D102A22EA6279fD856",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  919: {
    // Mode Sepolia
    identity: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
    score: "0x02593Bcd818F5403AB78018F068Dea3066BeCF55",
    attestation: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
    badge: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  },
  999999999: {
    // Zora Sepolia
    identity: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
    score: "0x02593Bcd818F5403AB78018F068Dea3066BeCF55",
    attestation: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
    badge: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  },
  1946: {
    // Soneium Minato
    identity: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf",
    score: "0xCa19812430a7Fe5F800066D102A22EA6279fD856",
    attestation: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
    badge: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  },
  11142220: {
    // Celo Sepolia
    identity: "0x27a4381ef8c9184fa82e7d13af96f562bcfe213b",
    score: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
    attestation: "0x9907bbe59b454aaf0a48b9346e34628081c4c107",
    badge: "0xf85eec2f56522ee12ec12f53b2bdf9917d68455f",
  },
};

// Backwards-compat: derived from CHAIN_REGISTRY, not separate maps
export const SURGE_IDENTITY_ADDRESSES: Record<number, `0x${string}`> = Object.fromEntries(
  Object.entries(CHAIN_REGISTRY).map(([k, v]) => [k, v.identity]),
);
export const SURGE_SCORE_ADDRESSES: Record<number, `0x${string}`> = Object.fromEntries(
  Object.entries(CHAIN_REGISTRY).map(([k, v]) => [k, v.score]),
);
export const SURGE_ATTESTATION_ADDRESSES: Record<number, `0x${string}`> = Object.fromEntries(
  Object.entries(CHAIN_REGISTRY).map(([k, v]) => [k, v.attestation]),
);
export const SURGE_BADGE_ADDRESSES: Record<number, `0x${string}`> = Object.fromEntries(
  Object.entries(CHAIN_REGISTRY).map(([k, v]) => [k, v.badge]),
);

// Default to Base Sepolia for backwards-compat single-address exports
export const SURGE_IDENTITY_ADDRESS = CHAIN_REGISTRY[84532].identity;
export const SURGE_SCORE_ADDRESS = CHAIN_REGISTRY[84532].score;
export const SURGE_ATTESTATION_ADDRESS = CHAIN_REGISTRY[84532].attestation;
export const SURGE_BADGE_ADDRESS = CHAIN_REGISTRY[84532].badge;

// ── Contract constants (mirrors SurgeIdentity.sol private constants) ─────────
// SECURITY_QUORUM is `private constant` in Solidity — no on-chain getter exists.
// Must be kept in sync manually if the contract is redeployed with a different value.
// Current value: SurgeIdentity.sol line 41 `uint8 private constant SECURITY_QUORUM = 2`.
export const SECURITY_QUORUM = 2;

// ── ABIs ──────────────────────────────────────────────────────────────────────

export const surgeIdentityAbi = [
  // ── Core functions ──────────────────────────────────────────────────────────
  {
    type: "function",
    name: "mint",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "linkWallet",
    inputs: [
      { name: "newWallet", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "sigCurrent", type: "bytes", internalType: "bytes" },
      { name: "sigNew", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPrimary",
    inputs: [{ name: "newPrimary", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "selfFreeze",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unfreeze",
    inputs: [
      { name: "wallet", type: "address", internalType: "address" },
      { name: "signers", type: "address[]", internalType: "address[]" },
      { name: "sigs", type: "bytes[]", internalType: "bytes[]" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "markCompromised",
    inputs: [
      { name: "wallet", type: "address", internalType: "address" },
      { name: "signers", type: "address[]", internalType: "address[]" },
      { name: "sigs", type: "bytes[]", internalType: "bytes[]" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelCompromise",
    inputs: [
      { name: "identityId", type: "uint256", internalType: "uint256" },
      { name: "requestIndex", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finalizeCompromise",
    inputs: [
      { name: "identityId", type: "uint256", internalType: "uint256" },
      { name: "requestIndex", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // ── Views ──────────────────────────────────────────────────────────────────
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
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "id", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalIdentities",
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
    type: "function",
    name: "primaryWallet",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "walletStatus",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint8", internalType: "enum SurgeIdentity.WalletStatus" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isSecurityWallet",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DOMAIN_SEPARATOR",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLinkedWallets",
    inputs: [{ name: "identityId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getActiveWallets",
    inputs: [{ name: "identityId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSecurityWallets",
    inputs: [{ name: "identityId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "compromiseRequestCount",
    inputs: [{ name: "identityId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "IdentityMinted",
    inputs: [
      { name: "wallet", type: "address", indexed: true, internalType: "address" },
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "position", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WalletLinked",
    inputs: [
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "newWallet", type: "address", indexed: true, internalType: "address" },
      { name: "promotedToSecurity", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CompromiseRequested",
    inputs: [
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "targetWallet", type: "address", indexed: true, internalType: "address" },
      { name: "requestIndex", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "requestedAt", type: "uint48", indexed: false, internalType: "uint48" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CompromiseCancelled",
    inputs: [
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "requestIndex", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "cancelledBy", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CompromiseFinalized",
    inputs: [
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "targetWallet", type: "address", indexed: true, internalType: "address" },
      { name: "requestIndex", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  // ── Errors ─────────────────────────────────────────────────────────────────
  { type: "error", name: "AlreadyHasIdentity", inputs: [] },
  { type: "error", name: "NoIdentity", inputs: [] },
  { type: "error", name: "Soulbound", inputs: [] },
  { type: "error", name: "WalletAlreadyLinked", inputs: [] },
  { type: "error", name: "DeadlineExpired", inputs: [] },
  { type: "error", name: "InvalidSignature", inputs: [] },
  { type: "error", name: "InsufficientSignatures", inputs: [] },
  { type: "error", name: "WalletNotActive", inputs: [] },
  { type: "error", name: "CannotFreezeLastActive", inputs: [] },
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
          { name: "identityId", type: "uint256", internalType: "uint256" },
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
    name: "BadgeClaimed",
    inputs: [
      { name: "badgeId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "identityId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "claimer", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
] as const;
