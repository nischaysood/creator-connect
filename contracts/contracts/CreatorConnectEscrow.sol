// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorConnectEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public mneeToken;
    address public verifierAgent;

    struct Campaign {
        uint256 id;
        address brand;
        string details; // JSON or IPFS hash with requirements
        uint256 rewardPerCreator;
        uint256 maxCreators;
        uint256 totalDeposited;
        uint256 totalPaid;
        bool isActive;
        uint256 createdAt;
    }

    struct Enrollment {
        address creator;
        string submissionUrl;
        bool isVerified;
        bool isPaid;
        uint256 joinedAt;
    }

    uint256 public nextCampaignId;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Enrollment[]) public campaignEnrollments;
    mapping(uint256 => mapping(address => bool)) public hasEnrolled;

    event CampaignCreated(uint256 indexed campaignId, address indexed brand, uint256 rewardPerCreator);
    event CreatorEnrolled(uint256 indexed campaignId, address indexed creator);
    event SubmissionVerified(uint256 indexed campaignId, address indexed creator, bool success);
    event PaymentReleased(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event CampaignFunded(uint256 indexed campaignId, uint256 amount);

    constructor(address _mneeToken, address _verifierAgent) Ownable(msg.sender) {
        mneeToken = IERC20(_mneeToken);
        verifierAgent = _verifierAgent;
    }

    modifier onlyVerifier() {
        require(msg.sender == verifierAgent, "Only verifier agent can call this");
        _;
    }

    function createCampaign(
        string memory _details,
        uint256 _rewardPerCreator,
        uint256 _maxCreators
    ) external nonReentrant returns (uint256) {
        require(_rewardPerCreator > 0, "Reward must be > 0");
        require(_maxCreators > 0, "Max creators must be > 0");
        
        uint256 totalRequired = _rewardPerCreator * _maxCreators;
        // Transfer funds from brand to escrow
        mneeToken.safeTransferFrom(msg.sender, address(this), totalRequired);

        uint256 campaignId = nextCampaignId++;
        campaigns[campaignId] = Campaign({
            id: campaignId,
            brand: msg.sender,
            details: _details,
            rewardPerCreator: _rewardPerCreator,
            maxCreators: _maxCreators,
            totalDeposited: totalRequired,
            totalPaid: 0,
            isActive: true,
            createdAt: block.timestamp
        });

        emit CampaignCreated(campaignId, msg.sender, _rewardPerCreator);
        emit CampaignFunded(campaignId, totalRequired);

        return campaignId;
    }

    function enroll(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");
        require(!hasEnrolled[_campaignId][msg.sender], "Already enrolled");
        require(campaignEnrollments[_campaignId].length < campaign.maxCreators, "Campaign full");

        enrollments(_campaignId).push(Enrollment({
            creator: msg.sender,
            submissionUrl: "",
            isVerified: false,
            isPaid: false,
            joinedAt: block.timestamp
        }));
        
        hasEnrolled[_campaignId][msg.sender] = true;
        emit CreatorEnrolled(_campaignId, msg.sender);
    }

    // Helper to access storage array
    function enrollments(uint256 _campaignId) internal view returns (Enrollment[] storage) {
        return campaignEnrollments[_campaignId];
    }

    function submitContent(uint256 _campaignId, string memory _url) external {
        require(hasEnrolled[_campaignId][msg.sender], "Not enrolled");
        
        Enrollment[] storage enrolled = campaignEnrollments[_campaignId];
        for (uint i = 0; i < enrolled.length; i++) {
            if (enrolled[i].creator == msg.sender) {
                require(!enrolled[i].isVerified, "Already verified");
                enrolled[i].submissionUrl = _url;
                break;
            }
        }
        // Emit event? Maybe just rely on enrollment update or explicit event if needed.
    }

    function verifyAndRelease(
        uint256 _campaignId,
        address _creator,
        bool _isValid
    ) external onlyVerifier nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");

        Enrollment[] storage enrolled = campaignEnrollments[_campaignId];
        for (uint i = 0; i < enrolled.length; i++) {
            if (enrolled[i].creator == _creator) {
                require(!enrolled[i].isPaid, "Already paid");
                
                if (_isValid) {
                    enrolled[i].isVerified = true;
                    enrolled[i].isPaid = true;
                    
                    campaign.totalPaid += campaign.rewardPerCreator;
                    mneeToken.safeTransfer(_creator, campaign.rewardPerCreator);
                    
                    emit PaymentReleased(_campaignId, _creator, campaign.rewardPerCreator);
                }
                
                emit SubmissionVerified(_campaignId, _creator, _isValid);
                return;
            }
        }
        revert("Creator not found in campaign");
    }

    function updateVerifier(address _newVerifier) external onlyOwner {
        verifierAgent = _newVerifier;
    }

    function getCampaignEnrollments(uint256 _campaignId) external view returns (Enrollment[] memory) {
        return campaignEnrollments[_campaignId];
    }
}
