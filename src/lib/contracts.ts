// ── Per-chain contract addresses (v2 — ERC-1155 UUPS rebuild) ─────────────────

export const SURGE_IDENTITY_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3", // Base Sepolia
  11155420: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // OP Sepolia
  1301: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Unichain Sepolia
  4202: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Lisk Sepolia
  4801: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Worldchain Sepolia
  763373: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Ink Sepolia
  919: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Mode Sepolia
  999999999: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Zora Sepolia
  1946: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Soneium Minato
  11142220: "0x27a4381ef8c9184fa82e7d13af96f562bcfe213b", // Celo Sepolia
};

export const SURGE_SCORE_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  11155420: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  1301: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  4202: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  4801: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  763373: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  919: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  999999999: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  1946: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  11142220: "0xff56358a8303060d117003ea1d6b0328af4615fa", // Celo Sepolia
};

export const SURGE_ATTESTATION_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  11155420: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  1301: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  4202: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  4801: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  763373: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  919: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  999999999: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  1946: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  11142220: "0x9907bbe59b454aaf0a48b9346e34628081c4c107", // Celo Sepolia
};

export const SURGE_BADGE_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0x3f694EB36609Cc52f0cBb9Beda3Df1B361A4B457",
  11155420: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  1301: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  4202: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  4801: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  763373: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  919: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  999999999: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  1946: "0x12B9DDcE9A0C73cec7bF5fCB089712Ce242eaeb1",
  11142220: "0xf85eec2f56522ee12ec12f53b2bdf9917d68455f", // Celo Sepolia
};

// Default to Base Sepolia for backwards-compat single-address exports
export const SURGE_IDENTITY_ADDRESS = SURGE_IDENTITY_ADDRESSES[84532];
export const SURGE_SCORE_ADDRESS = SURGE_SCORE_ADDRESSES[84532];
export const SURGE_ATTESTATION_ADDRESS = SURGE_ATTESTATION_ADDRESSES[84532];
export const SURGE_BADGE_ADDRESS = SURGE_BADGE_ADDRESSES[84532];

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
