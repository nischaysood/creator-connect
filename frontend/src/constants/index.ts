export const MOCK_MNEE_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ESCROW_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const ESCROW_ABI = [
    "function createCampaign(string details, uint256 reward, uint256 maxCreators) external",
    "function enroll(uint256 campaignId) external",
    "function submitContent(uint256 campaignId, string url) external",
    "function verifyAndRelease(uint256 campaignId, address creator, bool isValid) external",
    "function campaigns(uint256) view returns (uint256 id, address brand, string details, uint256 rewardPerCreator, uint256 maxCreators, uint256 totalDeposited, uint256 totalPaid, bool isActive, uint256 createdAt)",
    "function nextCampaignId() view returns (uint256)",
    "function getCampaignEnrollments(uint256 campaignId) view returns (tuple(address creator, string submissionUrl, bool isVerified, bool isPaid, uint256 joinedAt)[])",
    "function hasEnrolled(uint256 campaignId, address creator) view returns (bool)",
    "event CampaignCreated(uint256 indexed campaignId, address indexed brand, uint256 rewardPerCreator)",
    "event PaymentReleased(uint256 indexed campaignId, address indexed creator, uint256 amount)"
] as const;

export const MOCK_MNEE_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function mint(address to, uint256 amount) external"
] as const;
