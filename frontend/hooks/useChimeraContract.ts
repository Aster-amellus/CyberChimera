import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import ChimeraFactoryABI from '../contracts/ChimeraFactory.json';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useChimeraContract() {
  const { address } = useAccount();
  
  // Read functions
  const { data: isBorn } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ChimeraFactoryABI.abi,
    functionName: 'isBorn',
  });

  const { data: isContributor } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ChimeraFactoryABI.abi,
    functionName: 'isContributor',
    args: address ? [address] : undefined,
  });

  const { data: hasMinted } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ChimeraFactoryABI.abi,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  });

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ChimeraFactoryABI.abi,
    functionName: 'owner',
  });

  // Get all genes
  const useGetGene = (geneType: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ChimeraFactoryABI.abi,
      functionName: 'getGene',
      args: [geneType],
    });
  };

  // Write functions
  const { writeContract: contribute, data: contributeHash } = useWriteContract();
  const { isLoading: isContributing, isSuccess: contributionSuccess } = useWaitForTransactionReceipt({
    hash: contributeHash,
  });

  const { writeContract: birth, data: birthHash } = useWriteContract();
  const { isLoading: isBirthing, isSuccess: birthSuccess } = useWaitForTransactionReceipt({
    hash: birthHash,
  });

  const { writeContract: mint, data: mintHash } = useWriteContract();
  const { isLoading: isMinting, isSuccess: mintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  const { writeContract: setBaseURI, data: setBaseURIHash } = useWriteContract();
  const { isLoading: isSettingURI, isSuccess: setURISuccess } = useWaitForTransactionReceipt({
    hash: setBaseURIHash,
  });

  const contributeGene = async (geneType: number, value: number) => {
    contribute({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ChimeraFactoryABI.abi,
      functionName: 'contribute',
      args: [geneType, value],
    });
  };

  const birthChimera = async () => {
    birth({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ChimeraFactoryABI.abi,
      functionName: 'birth',
    });
  };

  const mintNFT = async () => {
    mint({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ChimeraFactoryABI.abi,
      functionName: 'mint',
    });
  };

  const updateBaseURI = async (uri: string) => {
    setBaseURI({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ChimeraFactoryABI.abi,
      functionName: 'setBaseURI',
      args: [uri],
    });
  };

  return {
    // State
    isBorn,
    isContributor,
    hasMinted,
    owner,
    isOwner: address && owner ? address.toLowerCase() === owner.toLowerCase() : false,
    
    // Read functions
    useGetGene,
    
    // Write functions
    contributeGene,
    birthChimera,
    mintNFT,
    updateBaseURI,
    
    // Transaction states
    isContributing,
    contributionSuccess,
    isBirthing,
    birthSuccess,
    isMinting,
    mintSuccess,
    isSettingURI,
    setURISuccess,
  };
}