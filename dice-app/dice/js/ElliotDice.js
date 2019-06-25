/* eslint-disable */
import IconService, { IconAmount, IconConverter, HttpProvider, IconWallet, IconBuilder, SignedTransaction } from 'icon-sdk-js';
import MockData from '../../mockData/index.js';

let ellitDice;

class ElliotDice {
	constructor() {
		this.provider = new HttpProvider(MockData.NODE_URL);
        this.iconService = new IconService(this.provider);
        this.wallet = IconWallet.loadPrivateKey(MockData.PRIVATE_KEY_1);
        this.scoreAddress = 'cx2833411c7a2ad267a3bc1f03e86f7c9f1d05656e';
        this.addListener();
    }

    addListener() {
        document.getElementById('diceRoll__roll').addEventListener('click', async () => {
            const input = document.getElementById('diceRoll__input').value
            if (!input) return alert('input Dice Number ;)');
            await this.rollDice(input);
        });
        document.getElementById('result').addEventListener('click', async () => {
            await this.checkTxResult(this.transactionTxHash);
        });
    }

    async getDefaultStepCost() {
        const { CallBuilder } = IconBuilder;

        const governanceApi = await this.iconService.getScoreApi(MockData.GOVERNANCE_ADDRESS).execute();
        const methodName = 'getStepCosts';
        const getStepCostsApi = governanceApi.getMethod(methodName);
        const getStepCostsApiInputs = getStepCostsApi.inputs.length > 0 ? JSON.stringify(getStepCostsApi.inputs) : 'none';
        const getStepCostsApiOutputs = getStepCostsApi.outputs.length > 0 ? JSON.stringify(getStepCostsApi.outputs) : 'none';
        console.log(`[getStepCosts]\n inputs: ${getStepCostsApiInputs} \n outputs: ${getStepCostsApiOutputs}`);
        const callBuilder = new CallBuilder();
        const call = callBuilder
            .to(MockData.GOVERNANCE_ADDRESS)
            .method(methodName)
            .build();
        const stepCosts = await this.iconService.call(call).execute();
        return IconConverter.toBigNumber(stepCosts.default).times(2)
    }

    async rollDice(input) {
        const { CallTransactionBuilder } = IconBuilder;
        document.getElementById("diceRoll__resultImg").src = 'http://images.battlecomics.co.kr/users/329616/page/item/dfe609ce-a16d-4814-8211-3e0b64719023.jpg'
        document.getElementById("diceRoll__resultNumber").innerHTML = '?'
        document.getElementById("diceRoll__resultStr").innerHTML = 'Show Result'

        const walletAddress = this.wallet.getAddress();
        const stepLimit = await this.getDefaultStepCost();
        const networkId = IconConverter.toBigNumber(3);
        const version = IconConverter.toBigNumber(3);
        const timestamp = (new Date()).getTime() * 1000;
        const methodName = "startGame";
        const params = { input }

        const tokenTransactionBuilder = new CallTransactionBuilder();
        const transaction = tokenTransactionBuilder
            .nid(networkId)
            .from(walletAddress)
            .to(this.scoreAddress)
            .stepLimit(stepLimit)
            .timestamp(timestamp)
            .method(methodName)
            .params(params)
            .version(version)
            .build();
        
        const signedTransaction = new SignedTransaction(transaction, this.wallet);
        this.transactionTxHash = await this.iconService.sendTransaction(signedTransaction).execute()
        console.log('this.transactionTxHash', this.transactionTxHash)
        document.getElementById('result').classList.add("diceRoll__result--show")
    }

    async checkTxResult(txHash) {
        const result = await this.iconService.getTransactionResult(txHash).execute()
        const resultNumber = result.eventLogs[0].indexed[1].slice(-1)
        const resultStr = resultNumber == 6 ? 'WIN :)' : 'LOSE ;('
        const resultImg = resultNumber == 6 ? 'https://t1.daumcdn.net/cfile/tistory/245CD63858706E7B1B' : 'http://2runzzal.com/media/dzEyOS9UbDJva0s1NXJOK3FkcENDdz09/zzal.jpg'
        document.getElementById("diceRoll__resultNumber").innerHTML = resultNumber
        document.getElementById("diceRoll__resultStr").innerHTML = resultStr
        document.getElementById("diceRoll__resultImg").src = resultImg
        console.log('result', result)
    }
}

if (document.getElementById('diceRoll')) {
    elliotDice = new ElliotDice();
}

export default ElliotDice;
