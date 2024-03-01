import { formatAbi } from 'abitype';
import { BytesLike, ethers } from 'ethers';

export class ScService {
  private readonly contract: ethers.Contract;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(
    contractAddress: string,
    contractABI: any[],
    provider: ethers.JsonRpcProvider
  ) {
    const _abi = contractABI ? JSON.parse(JSON.stringify(contractABI)) : [];

    const abi = formatAbi(
      _abi.filter((item: { type: string }) => item.type === 'function')
    );

    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async callMethod(functionName: string, ...args: any[]) {
    const f = this.contract.interface.getFunction(functionName);
    if (!f) return new Error(`Function ${functionName} not found`);
    console.log('f', f);
    try {
      return await this.contract[functionName](...args);
    } catch (error) {
      throw new Error(`Error calling function ${functionName}: ${error}`);
    }
  }

  decodeResult(functionName: string, value: BytesLike) {
    const f = this.contract.interface.getFunction(functionName);
    if (!f) return new Error(`Function ${functionName} not found`);
    return this.contract.interface.decodeFunctionResult(functionName, value);
  }
}
