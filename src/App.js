import React from "react";
import {
    Tab,
    Tabs,
    RadioGroup,
    Radio,
    FormGroup,
    InputGroup,
    NumericInput,
} from "@blueprintjs/core";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";
import {
    Address,
    BaseAddress,
    MultiAsset,
    Assets,
    ScriptHash,
    Costmdls,
    Language,
    CostModel,
    AssetName,
    TransactionUnspentOutput,
    TransactionUnspentOutputs,
    TransactionOutput,
    Value,
    TransactionBuilder,
    TransactionBuilderConfigBuilder,
    TransactionOutputBuilder,
    LinearFee,
    BigNum,
    BigInt,
    TransactionHash,
    TransactionInputs,
    TransactionInput,
    TransactionWitnessSet,
    Transaction,
    PlutusData,
    PlutusScripts,
    PlutusScript,
    PlutusList,
    Redeemers,
    Redeemer,
    RedeemerTag,
    Ed25519KeyHashes,
    ConstrPlutusData,
    ExUnits,
    Int,
    NetworkInfo,
    EnterpriseAddress,
    TransactionOutputs,
    hash_transaction,
    hash_script_data,
    hash_plutus_data,
    ScriptDataHash,
    Ed25519KeyHash,
    NativeScript,
    StakeCredential,
    NativeScripts,
    ScriptAny,
    ScriptPubkey,
    TransactionOutputAmountBuilder,
    ScriptAll,
} from "@emurgo/cardano-serialization-lib-asmjs";
import { blake2b } from "blakejs";
import AGIXPlutus from "./AGIX.plutus";
let Buffer = require("buffer/").Buffer;
let blake = require("blakejs");

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTabId: "2",
            whichWalletSelected: "nami",
            walletFound: false,
            walletIsEnabled: false,
            walletName: undefined,
            walletIcon: undefined,
            walletAPIVersion: undefined,

            networkId: undefined,
            Utxos: undefined,
            CollatUtxos: undefined,
            balance: undefined,
            changeAddress: undefined,
            rewardAddress: undefined,
            usedAddress: undefined,

            txBody: undefined,
            txBodyCborHex_unsigned: "",
            txBodyCborHex_signed: "",
            submittedTxHash: "",

            addressBech32SendADA:
                "addr_test1qq4wc8fhd2td9leuvfschm7cs47rpdzyfde37603vqn2ca9uw698l3v5ejqxzwhyyck0dr59mrx2cqee77wztyttcufq4vnxuh",
            lovelaceToSend: 3000000,
            assetNameHex: "41474958",
            assetPolicyIdHex:
                "6f1a1f0c7ccf632cc9ff4b79687ed13ffe5b624cce288b364ebdce50",
            assetAmountToSend: 5,
            addressScriptBech32:
                "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8",
            datumStr: "12345678",
            plutusScriptCborHex:
                "590b71590b6e010000333323322332233322232323233322233322233333333222222223322333332222233332222333222332233223322333222332233223322332233223232332232323232323232323232323322323232323232323232323232323232323232323232323232323232323232322223355032350040142232323233030333502e02d35502c50010065335304c3302b35502a50014800041384cc0c0cc0854008020cc0c0cc085400801cccd40bc0b402001c54cd4d41a8cd540d80c4c0c140044c00858884d4d5540d80088894cd4d41bc0104cd541d4008004884c024584c0d80088d41992401206578706563746564206f6e6c79206f6e65206d696e74696e6720706f6c69637900122223005330033004002300600125335304300110661350603530653357389201025064000664988c8c8c8c8c8c8cccd5cd19b8735573aa00a90001280112803a4c26606aa002a0042600c6ae8540084c050d5d09aba25001135573ca00226ea80084d417d262323232323232323232323232323232323232323232323333573466e1cd55cea80aa40004a0044a02e93099999999998232800a8012801a8022802a8032803a8042804a805099a81080b1aba15012133502001635742a0202666aa032eb94060d5d0a8070999aa80c3ae501735742a018266a03a0426ae8540284cd4070cd54078085d69aba15008133501675a6ae8540184cd4069d71aba150041335019335501b75c0346ae8540084c080d5d09aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea80084d41792623232323232323333573466e1cd55cea802a40004a0044a00e9309981ba800a8010980b9aba1500213005357426ae8940044d55cf280089baa00213505d4988c8c8c8c8c8c8c8c8cccd5cd19b8735573aa00e90001280112804a4c2666074a002a004a006260106ae8540104ccd54029d728049aba15002133500775c6ae84d5d1280089aba25001135573ca00226ea80084d41712623232323232323333573466e1cd55cea802a40004a0044a00e9309981ca800a8010980a1aba150021335005012357426ae8940044d55cf280089baa00213505b498488c8c8c8c8c8c8cccd5cd19b8750044800094008940112613503c500113006357426aae79400c4cccd5cd19b87500148008940e89401126135573aa00226ea80084d416d261335500175ceb444888c8c8c004dd58019a80090008918009aa832111919191919191999aab9f0075506425002069133506550025001130063574400a266aa0d0a002a004260106aae7540084c018d55cf280089aba10011223232323232323333573466e1cd55cea802a40004a0044a00e93099a81da800a801099a8038031aba150021335007005357426ae8940044d55cf280089baa002135058498488c8c8c8c8c8c8cccd5cd19b8735573aa00a90001280112803a4c266a07ca002a004266a01000c6ae8540084c020d5d09aba25001135573ca00226ea80084d415d261223232323232323333573466e1cd55cea802a40004a0044a00e93099a81da800a801099a8038031aba1500213007357426ae8940044d55cf280089baa002135056498488c8c8c8c8c8c8c8cccd5cd19b8750054801094110940092613333573466e1d4011200225002250044984d410d40044c018d5d09aab9e500313333573466e1d4005200025041250044984d55cea80089baa0021350554988c8c8c8cccd5cd19b8750024800880f0940092613333573466e1d40052000203a250034984d55ce9baa002135053498488c8c8c004dd60019a80090008918009aa82e911999aab9f0012505b233505a30063574200460066ae88008170800444888c8c8c8c8c8c8cccd5cd19b8735573aa00a90001280112803a4c266aa0bea002a0042600e6ae8540084c014d5d09aba25001135573ca00226ea80084d414926232323232323232323232323232323333573466e1d4029200625002250044984c12940044c038d5d09aab9e500b13333573466e1d401d200425002250044984c11540044c030d5d09aab9e500813333573466e1d4011200225002250044984c10540044c02cd5d09aab9e500513333573466e1d4005200025003250064984d55cea8018981fa80089bae357426aae7940044dd500109a827a4c4646464646464646464646464646464646464646464646464646666ae68cdc3a80aa401840b84a0049309999ab9a3370ea0289005102e1280124c26666ae68cdc3a809a40104a0044a00c9309982b2800a80109bae35742a00426eb4d5d09aba25001135573ca02426666ae68cdc3a8072400c4a0044a00c930998292800a80109bae35742a00426eb8d5d09aba25001135573ca01a26666ae68cdc3a804a40084a0044a00c93099828a800a801098069aba150021375c6ae84d5d1280089aab9e500813333573466e1d4011200225002250044984c13540044c020d5d09aab9e500513333573466e1d4005200025003250064984d55cea80189823a800898021aba135573ca00226ea80084d41392623232323232323232323232323333573466e1d4021200225002250084984ccc14940054009400c4dd69aba150041375a6ae8540084dd69aba135744a00226ae8940044d55cf280289999ab9a3370ea0029000128019280324c26aae75400c4c12d40044c010d5d09aab9e50011375400426a09a93119191919191919191999ab9a3370ea0089001128011280224c260a0a00226eb8d5d09aab9e500513333573466e1d4005200025003250064984d55cea80189826a80089bae357426aae7940044dd500109a82624c46464646464646666ae68cdc39aab9d500548000940089401d26133040500150021300635742a00426eb4d5d09aba25001135573ca00226ea80084d412d2623232323333573466e1cd55cea801240004a0044a0089309bae357426aae7940044dd500109a82524c446a60380044444444444a66a6a05c666aa601e24002a01a4a66a6070666ae68cdc780600081d01c89a8188008a8180019081d081c099a803a800a811091299a9a8110011080188009a80090008918009aa827110891911299a9a82680089a80400211099a8029802001199aa98040900080300200089a803000891a9a80180091000891a9a801000910010910919800801801090008891a9aa8238009100091199ab9a3371000400204a0482246a6aa08a0024400444666ae68cdc7801000811811090008911299a9810198018010008810881111299a980f0010800880f91a9805800911111111100391a801091199aa802911a9aa82180111199aa804911a9aa82380111299a9812999ab9a3370e00290000138130801899805199aaa8078030010008018018008008018919a800a81d281d889119190009a80090008918009aa82091299a9a81e00088021109980380118020008889110919980080200180108890008891180100091a9801000910011109198008018011000911111111109199999999980080580500480400380300280200180110009109198008018011000911091998008020018011000910919800801801100089091180100188910008900089109198008018010900089109198008018010900089109198008018010900089100109100090008909111801802089110010891100089000909111180200290911118018029091111801002909111180080290009109198008018011000909111111180380411091111111980300480410911111118028040911111100209111111001910911111119801004804110911111119800804804100090911801001911091199800802802001900090911801001909118008019000891a8011a980399ab9c00100849849844940104488008488488cc00401000c48004480048004448848cc00400c008448004448c8c00400488cc00cc00800800522011c1487b3f5a9b762f1777c6215a98d811949964268d66a22cfc6c589c60048811ca51a75a81478e38bfb9a847be8c0f9314a74cc66e4ddad416dbf918f00488104414749580001",
            transactionIdLocked: "",
            transactionIndxLocked: 0,
            lovelaceLocked: 3000000,
            manualFee: 900000,
        };

        /**
         * When the wallet is connect it returns the connector which is
         * written to this API variable and all the other operations
         * run using this API object
         */
        this.API = undefined;

        /**
         * Protocol parameters
         * @type {{
         * keyDeposit: string,
         * coinsPerUtxoWord: string,
         * minUtxo: string,
         * poolDeposit: string,
         * maxTxSize: number,
         * priceMem: number,
         * maxValSize: number,
         * linearFee: {minFeeB: string, minFeeA: string}, priceStep: number
         * }}
         */
        this.protocolParams = {
            linearFee: {
                minFeeA: "44",
                minFeeB: "155381",
            },
            minUtxo: "34482",
            poolDeposit: "500000000",
            keyDeposit: "2000000",
            maxValSize: 5000,
            maxTxSize: 16384,
            priceMem: 0.0577,
            priceStep: 0.0000721,
            coinsPerUtxoWord: "34482",
        };
    }

    /**
     * Handles the tab selection on the user form
     * @param tabId
     */
    handleTabId = (tabId) => this.setState({ selectedTabId: tabId });

    /**
     * Handles the radio buttons on the form that
     * let the user choose which wallet to work with
     * @param obj
     */
    handleWalletSelect = (obj) => {
        const whichWalletSelected = obj.target.value;
        this.setState({ whichWalletSelected }, () => {
            this.refreshData();
        });
    };

    /**
     * Generate address from the plutus contract cborhex
     */
    generateScriptAddress = () => {
        // cborhex of the alwayssucceeds.plutus
        // const cborhex = "4e4d01000033222220051200120011";
        // const cbor = Buffer.from(cborhex, "hex");
        // const blake2bhash = blake.blake2b(cbor, 0, 28);

        const script = PlutusScript.from_bytes(
            Buffer.from(this.state.plutusScriptCborHex, "hex")
        );
        // const blake2bhash = blake.blake2b(script.to_bytes(), 0, 28);
        const blake2bhash =
            "67f33146617a5e61936081db3b2117cbf59bd2123748f58ac9678656";
        const scripthash = ScriptHash.from_bytes(Buffer.from(blake2bhash, "hex"));

        const cred = StakeCredential.from_scripthash(scripthash);
        const networkId = NetworkInfo.testnet().network_id();
        const baseAddr = EnterpriseAddress.new(networkId, cred);
        const addr = baseAddr.to_address();
        const addrBech32 = addr.to_bech32();

        // hash of the address generated from script
        console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"));

        // hash of the address generated using cardano-cli
        const ScriptAddress = Address.from_bech32(
            "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8"
        );
        console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"));

        console.log(ScriptAddress.to_bech32());
        console.log(addrBech32);
    };

    /**
     * Checks if the wallet is running in the browser
     * Does this for Nami, CCvault and Flint wallets
     * @returns {boolean}
     */

    checkIfWalletFound = () => {
        let walletFound = false;

        const wallet = this.state.whichWalletSelected;
        if (wallet === "nami") {
            walletFound = !!window?.cardano?.nami;
        } else if (wallet === "ccvault") {
            walletFound = !!window?.cardano?.ccvault;
        } else if (wallet === "flint") {
            walletFound = !!window?.cardano?.flint;
        }

        this.setState({ walletFound });
        return walletFound;
    };

    /**
     * Checks if a connection has been established with
     * the wallet
     * @returns {Promise<boolean>}
     */
    checkIfWalletEnabled = async () => {
        let walletIsEnabled = false;

        try {
            const wallet = this.state.whichWalletSelected;
            if (wallet === "nami") {
                walletIsEnabled = await window.cardano.nami.isEnabled();
            } else if (wallet === "ccvault") {
                walletIsEnabled = await window.cardano.ccvault.isEnabled();
            } else if (wallet === "flint") {
                walletIsEnabled = await window.cardano.flint.isEnabled();
            }

            this.setState({ walletIsEnabled });
        } catch (err) {
            console.log(err);
        }

        return walletIsEnabled;
    };

    /**
     * Enables the wallet that was chosen by the user
     * When this executes the user should get a window pop-up
     * from the wallet asking to approve the connection
     * of this app to the wallet
     * @returns {Promise<void>}
     */

    enableWallet = async () => {
        try {
            const wallet = this.state.whichWalletSelected;
            if (wallet === "nami") {
                this.API = await window.cardano.nami.enable();
            } else if (wallet === "ccvault") {
                this.API = await window.cardano.ccvault.enable();
            } else if (wallet === "flint") {
                this.API = await window.cardano.flint.enable();
            }

            await this.checkIfWalletEnabled();
            await this.getNetworkId();
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Get the API version used by the wallets
     * writes the value to state
     * @returns {*}
     */
    getAPIVersion = () => {
        let walletAPIVersion;

        const wallet = this.state.whichWalletSelected;
        if (wallet === "nami") {
            walletAPIVersion = window?.cardano?.nami.apiVersion;
        } else if (wallet === "ccvault") {
            walletAPIVersion = window?.cardano?.ccvault.apiVersion;
        } else if (wallet === "flint") {
            walletAPIVersion = window?.cardano?.flint.apiVersion;
        }

        this.setState({ walletAPIVersion });
        return walletAPIVersion;
    };

    /**
     * Get the name of the wallet (nami, ccvault, flint)
     * and store the name in the state
     * @returns {*}
     */

    getWalletName = () => {
        let walletName;

        const wallet = this.state.whichWalletSelected;
        if (wallet === "nami") {
            walletName = window?.cardano?.nami.name;
        } else if (wallet === "ccvault") {
            walletName = window?.cardano?.ccvault.name;
        } else if (wallet === "flint") {
            walletName = window?.cardano?.flint.name;
        }

        this.setState({ walletName });
        return walletName;
    };

    /**
     * Gets the Network ID to which the wallet is connected
     * 0 = testnet
     * 1 = mainnet
     * Then writes either 0 or 1 to state
     * @returns {Promise<void>}
     */
    getNetworkId = async () => {
        try {
            const networkId = await this.API.getNetworkId();
            this.setState({ networkId });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Gets the UTXOs from the user's wallet and then
     * stores in an object in the state
     * @returns {Promise<void>}
     */

    getUtxos = async () => {
        let Utxos = [];

        try {
            const rawUtxos = await this.API.getUtxos();

            for (const rawUtxo of rawUtxos) {
                const utxo = TransactionUnspentOutput.from_bytes(
                    Buffer.from(rawUtxo, "hex")
                );
                const input = utxo.input();
                const txid = Buffer.from(
                    input.transaction_id().to_bytes(),
                    "utf8"
                ).toString("hex");
                const txindx = input.index();
                const output = utxo.output();
                const amount = output.amount().coin().to_str(); // ADA amount in lovelace
                const multiasset = output.amount().multiasset();
                let multiAssetStr = "";

                if (multiasset) {
                    const keys = multiasset.keys(); // policy Ids of thee multiasset
                    const N = keys.len();
                    // console.log(`${N} Multiassets in the UTXO`)

                    for (let i = 0; i < N; i++) {
                        const policyId = keys.get(i);
                        const policyIdHex = Buffer.from(
                            policyId.to_bytes(),
                            "utf8"
                        ).toString("hex");
                        // console.log(`policyId: ${policyIdHex}`)
                        const assets = multiasset.get(policyId);
                        const assetNames = assets.keys();
                        const K = assetNames.len();
                        // console.log(`${K} Assets in the Multiasset`)

                        for (let j = 0; j < K; j++) {
                            const assetName = assetNames.get(j);
                            const assetNameString = Buffer.from(
                                assetName.name(),
                                "utf8"
                            ).toString();
                            const assetNameHex = Buffer.from(
                                assetName.name(),
                                "utf8"
                            ).toString("hex");
                            const multiassetAmt = multiasset.get_asset(policyId, assetName);
                            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
                            // console.log(assetNameString)
                            // console.log(`Asset Name: ${assetNameHex}`)
                        }
                    }
                }

                const obj = {
                    txid: txid,
                    txindx: txindx,
                    amount: amount,
                    str: `${txid} #${txindx} = ${amount}`,
                    multiAssetStr: multiAssetStr,
                    TransactionUnspentOutput: utxo,
                };
                Utxos.push(obj);
                // console.log(`utxo: ${str}`)
            }
            this.setState({ Utxos });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * The collateral is need for working with Plutus Scripts
     * Essentially you need to provide collateral to pay for fees if the
     * script execution fails after the script has been validated...
     * this should be an uncommon occurrence and would suggest the smart contract
     * would have been incorrectly written.
     * The amount of collateral to use is set in the wallet
     * @returns {Promise<void>}
     */
    getCollateral = async () => {
        let CollatUtxos = [];

        try {
            let collateral = [];

            const wallet = this.state.whichWalletSelected;
            if (wallet === "nami") {
                collateral = await this.API.experimental.getCollateral();
            } else {
                collateral = await this.API.getCollateral();
            }

            for (const x of collateral) {
                const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(x, "hex"));
                CollatUtxos.push(utxo);
                // console.log(utxo)
            }
            this.setState({ CollatUtxos });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Gets the current balance of in Lovelace in the user's wallet
     * This doesnt resturn the amounts of all other Tokens
     * For other tokens you need to look into the full UTXO list
     * @returns {Promise<void>}
     */
    getBalance = async () => {
        try {
            const balanceCBORHex = await this.API.getBalance();

            const balance = Value.from_bytes(Buffer.from(balanceCBORHex, "hex"))
                .coin()
                .to_str();
            this.setState({ balance });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Get the address from the wallet into which any spare UTXO should be sent
     * as change when building transactions.
     * @returns {Promise<void>}
     */
    getChangeAddress = async () => {
        try {
            const raw = await this.API.getChangeAddress();
            const changeAddress = Address.from_bytes(
                Buffer.from(raw, "hex")
            ).to_bech32();
            this.setState({ changeAddress });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * This is the Staking address into which rewards from staking get paid into
     * @returns {Promise<void>}
     */
    getRewardAddresses = async () => {
        try {
            const raw = await this.API.getRewardAddresses();
            const rawFirst = raw[0];
            const rewardAddress = Address.from_bytes(
                Buffer.from(rawFirst, "hex")
            ).to_bech32();
            // console.log(rewardAddress)
            this.setState({ rewardAddress });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Gets previsouly used addresses
     * @returns {Promise<void>}
     */
    getUsedAddresses = async () => {
        try {
            const raw = await this.API.getUsedAddresses();
            const rawFirst = raw[0];
            const usedAddress = Address.from_bytes(
                Buffer.from(rawFirst, "hex")
            ).to_bech32();
            // console.log(rewardAddress)
            this.setState({ usedAddress });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Refresh all the data from the user's wallet
     * @returns {Promise<void>}
     */
    refreshData = async () => {
        this.generateScriptAddress();

        try {
            const walletFound = this.checkIfWalletFound();
            if (walletFound) {
                await this.enableWallet();
                await this.getAPIVersion();
                await this.getWalletName();
                await this.getUtxos();
                await this.getCollateral();
                await this.getBalance();
                await this.getChangeAddress();
                await this.getRewardAddresses();
                await this.getUsedAddresses();
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Every transaction starts with initializing the
     * TransactionBuilder and setting the protocol parameters
     * This is boilerplate
     * @returns {Promise<TransactionBuilder>}
     */
    initTransactionBuilder = async () => {
        const txBuilder = TransactionBuilder.new(
            TransactionBuilderConfigBuilder.new()
                .fee_algo(
                    LinearFee.new(
                        BigNum.from_str(this.protocolParams.linearFee.minFeeA),
                        BigNum.from_str(this.protocolParams.linearFee.minFeeB)
                    )
                )
                .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
                .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
                .coins_per_utxo_word(
                    BigNum.from_str(this.protocolParams.coinsPerUtxoWord)
                )
                .max_value_size(this.protocolParams.maxValSize)
                .max_tx_size(this.protocolParams.maxTxSize)
                .prefer_pure_change(true)
                .build()
        );

        return txBuilder;
    };

    /**
     * Builds an object with all the UTXOs from the user's wallet
     * @returns {Promise<TransactionUnspentOutputs>}
     */
    getTxUnspentOutputs = async () => {
        let txOutputs = TransactionUnspentOutputs.new();
        for (const utxo of this.state.Utxos) {
            txOutputs.add(utxo.TransactionUnspentOutput);
        }
        return txOutputs;
    };

    /**
     * The transaction is build in 3 stages:
     * 1 - initialize the Transaction Builder
     * 2 - Add inputs and outputs
     * 3 - Calculate the fee and how much change needs to be given
     * 4 - Build the transaction body
     * 5 - Sign it (at this point the user will be prompted for
     * a password in his wallet)
     * 6 - Send the transaction
     * @returns {Promise<void>}
     */
    buildSendADATransaction = async () => {
        const txBuilder = await this.initTransactionBuilder();
        const shelleyOutputAddress = Address.from_bech32(
            this.state.addressBech32SendADA
        );
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        txBuilder.add_output(
            TransactionOutput.new(
                shelleyOutputAddress,
                Value.new(BigNum.from_str(this.state.lovelaceToSend.toString()))
            )
        );

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 3);

        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress);

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );

        console.log(txVkeyWitnesses);

        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({ submittedTxHash });
    };

    buildSendTokenTransaction = async () => {
        const addr = 'addr_test1qq4wc8fhd2td9leuvfschm7cs47rpdzyfde37603vqn2ca9uw698l3v5ejqxzwhyyck0dr59mrx2cqee77wztyttcufq4vnxuh'
        const txBuilder = await this.initTransactionBuilder();
        const shelleyOutputAddress = Address.from_bech32(
            addr
        );
        const shelleyChangeAddress = Address.from_bech32(addr);

        console.log("shelleyOutputAddress", shelleyOutputAddress)
        console.log("shelleyChangeAddress", shelleyChangeAddress)

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(shelleyOutputAddress);
        txOutputBuilder = txOutputBuilder.next();

        let multiAsset = MultiAsset.new();
        let assets = Assets.new();
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str(this.state.assetAmountToSend.toString()) // How much to send
        );
        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(
            multiAsset,
            BigNum.from_str(this.protocolParams.coinsPerUtxoWord)
        );
        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput);


        // Minting script

        const baseAddr = BaseAddress.from_address(shelleyChangeAddress);
        const keyHash = baseAddr.payment_cred().to_keyhash()


        const scripts = NativeScripts.new();

        scripts.add(NativeScript.new_script_pubkey(
            ScriptPubkey.new(keyHash),
        ));

        const mintScript = NativeScript.new_script_all(
            ScriptAll.new(scripts),
        );

        const txnOpBuilder = new TransactionOutputAmountBuilder()
        txnOpBuilder.with_asset_and_min_required_coin(
            multiAsset,
            BigNum.from_str(this.protocolParams.coinsPerUtxoWord)
        );
        txnOpBuilder.with_coin_and_asset()

        const txnOpBuild = txOutputBuilder.build();

        // Burn amount
        txBuilder.add_mint_asset_and_output_min_required_coin(
            mintScript,
            AssetName.new(this.state.assetNameHex),
            Int.new_negative(BigNum.from_str(this.state.assetAmountToSend.toString())),
            txOutput
        );

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 2);


        // set the time to live - the absolute slot value before the tx becomes invalid
        // txBuilder.set_ttl(51821456);

        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress);

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // const emptyRedeemer = Redeemer.new();
        // emptyRedeemer.tag = RedeemerTag.new_mint();
        // console.log('emptyRedeemer.index()', emptyRedeemer.index())

        const redeemers = Redeemers.new();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();
        transactionWitnessSet.set_redeemers(redeemers);

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({ submittedTxHash });

        // const txBodyCborHex_unsigned = Buffer.from(txBody.to_bytes(), "utf8").toString("hex");
        // this.setState({txBodyCborHex_unsigned, txBody})
    };

    buildSendAdaToPlutusScript = async () => {
        const txBuilder = await this.initTransactionBuilder();
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        let txOutputBuilder = TransactionOutputBuilder.new();

        txOutputBuilder = txOutputBuilder.next();

        txOutputBuilder = txOutputBuilder.with_value(
            Value.new(BigNum.from_str(this.state.lovelaceToSend.toString()))
        );
        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput);

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 2);

        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress);

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({
            submittedTxHash: submittedTxHash,
            transactionIdLocked: submittedTxHash,
            lovelaceLocked: this.state.lovelaceToSend,
        });
    };

    buildSendTokenToPlutusScript = async () => {
        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(ScriptAddress);
        const dataHash = hash_plutus_data(
            PlutusData.new_integer(BigInt.from_str(this.state.datumStr))
        );
        txOutputBuilder = txOutputBuilder.with_data_hash(dataHash);

        txOutputBuilder = txOutputBuilder.next();

        let multiAsset = MultiAsset.new();
        let assets = Assets.new();
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str("-1") // How much to send
        );
        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        const feeAmount = BigNum.from_str("1000000");
        const toSend = Number(this.state.lovelaceToSend) + Number(feeAmount);

        // txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, BigNum.from_str(this.protocolParams.coinsPerUtxoWord))

        txOutputBuilder = txOutputBuilder.with_coin_and_asset(
            BigNum.from_str(toSend.toString()),
            multiAsset
        );

        const txOutput = txOutputBuilder.build();

        txBuilder.add_output(txOutput);

        const policyScripts = NativeScripts.new();
        policyScripts.add(
            PlutusScripts.from_bytes(
                Buffer.from(this.state.plutusScriptCborHex, "hex")
            )
        ); //from cbor of plutus script

        // Find the available UTXOs in the wallet and
        // us them as Inputs
        const txUnspentOutputs = await this.getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 2);

        // calculate the min fee required and send any change to an address
        txBuilder.add_change_if_needed(shelleyChangeAddress);
        // txBuilder.set_fee(feeAmount);

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();
        transactionWitnessSet.set_plutus_scripts(policyScripts);
        console.log("Txn Fee: ", txBody.fee().to_str());

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({
            submittedTxHash: submittedTxHash,
            transactionIdLocked: submittedTxHash,
            lovelaceLocked: this.state.lovelaceToSend,
        });
    };

    buildRedeemAdaFromPlutusScript = async () => {
        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        txBuilder.add_input(
            ScriptAddress,
            TransactionInput.new(
                TransactionHash.from_bytes(
                    Buffer.from(this.state.transactionIdLocked, "hex")
                ),
                this.state.transactionIndxLocked.toString()
            ),
            Value.new(BigNum.from_str(this.state.lovelaceLocked.toString()))
        ); // how much lovelace is at that UTXO

        txBuilder.set_fee(BigNum.from_str(Number(this.state.manualFee).toString()));

        const scripts = PlutusScripts.new();
        scripts.add(
            PlutusScript.from_bytes(
                Buffer.from(this.state.plutusScriptCborHex, "hex")
            )
        ); //from cbor of plutus script

        // Add outputs
        const outputVal =
            this.state.lovelaceLocked.toString() - Number(this.state.manualFee);
        const outputValStr = outputVal.toString();
        txBuilder.add_output(
            TransactionOutput.new(
                shelleyChangeAddress,
                Value.new(BigNum.from_str(outputValStr))
            )
        );

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        const collateral = this.state.CollatUtxos;
        const inputs = TransactionInputs.new();
        collateral.forEach((utxo) => {
            inputs.add(utxo.input());
        });

        let datums = PlutusList.new();
        // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
        datums.add(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)));

        const redeemers = Redeemers.new();

        const data = PlutusData.new_constr_plutus_data(
            ConstrPlutusData.new(BigNum.from_str("0"), PlutusList.new())
        );

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),
            data,
            ExUnits.new(BigNum.from_str("7000000"), BigNum.from_str("3000000000"))
        );

        redeemers.add(redeemer);

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        transactionWitnessSet.set_plutus_scripts(scripts);
        transactionWitnessSet.set_plutus_data(datums);
        transactionWitnessSet.set_redeemers(redeemers);

        const cost_model_vals = [
            197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32,
            2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773,
            100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32,
            150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118,
            0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1,
            136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000,
            32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276,
            1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
            150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1,
            150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1,
            2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0,
            1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000,
            32, 150000, 32, 3345831, 1, 1,
        ];

        const costModel = CostModel.new();
        cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));

        const costModels = Costmdls.new();
        costModels.insert(Language.new_plutus_v1(), costModel);

        const scriptDataHash = hash_script_data(redeemers, costModels, datums);
        txBody.set_script_data_hash(scriptDataHash);

        txBody.set_collateral(inputs);

        const baseAddress = BaseAddress.from_address(shelleyChangeAddress);
        const requiredSigners = Ed25519KeyHashes.new();
        requiredSigners.add(baseAddress.payment_cred().to_keyhash());

        txBody.set_required_signers(requiredSigners);

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({ submittedTxHash });
    };

    buildRedeemTokenFromPlutusScript = async () => {
        const txBuilder = await this.initTransactionBuilder();
        const ScriptAddress = Address.from_bech32(this.state.addressScriptBech32);
        const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

        let multiAsset = MultiAsset.new();
        let assets = Assets.new();
        assets.insert(
            AssetName.new(Buffer.from(this.state.assetNameHex, "hex")), // Asset Name
            BigNum.from_str(this.state.assetAmountToSend.toString()) // How much to send
        );

        multiAsset.insert(
            ScriptHash.from_bytes(Buffer.from(this.state.assetPolicyIdHex, "hex")), // PolicyID
            assets
        );

        txBuilder.add_input(
            ScriptAddress,
            TransactionInput.new(
                TransactionHash.from_bytes(
                    Buffer.from(this.state.transactionIdLocked, "hex")
                ),
                this.state.transactionIndxLocked.toString()
            ),
            Value.new_from_assets(multiAsset)
        ); // how much lovelace is at that UTXO

        txBuilder.set_fee(BigNum.from_str(Number(this.state.manualFee).toString()));

        const scripts = PlutusScripts.new();
        scripts.add(
            PlutusScript.from_bytes(
                Buffer.from(this.state.plutusScriptCborHex, "hex")
            )
        ); //from cbor of plutus script

        // Add outputs
        const outputVal =
            this.state.lovelaceLocked.toString() - Number(this.state.manualFee);
        const outputValStr = outputVal.toString();

        let txOutputBuilder = TransactionOutputBuilder.new();
        txOutputBuilder = txOutputBuilder.with_address(shelleyChangeAddress);
        txOutputBuilder = txOutputBuilder.next();
        txOutputBuilder = txOutputBuilder.with_coin_and_asset(
            BigNum.from_str(outputValStr),
            multiAsset
        );

        const txOutput = txOutputBuilder.build();
        txBuilder.add_output(txOutput);

        // once the transaction is ready, we build it to get the tx body without witnesses
        const txBody = txBuilder.build();

        const collateral = this.state.CollatUtxos;
        const inputs = TransactionInputs.new();
        collateral.forEach((utxo) => {
            inputs.add(utxo.input());
        });

        let datums = PlutusList.new();
        // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
        datums.add(PlutusData.new_integer(BigInt.from_str(this.state.datumStr)));

        const redeemers = Redeemers.new();

        const data = PlutusData.new_constr_plutus_data(
            ConstrPlutusData.new(BigNum.from_str("0"), PlutusList.new())
        );

        const redeemer = Redeemer.new(
            RedeemerTag.new_spend(),
            BigNum.from_str("0"),
            data,
            ExUnits.new(BigNum.from_str("7000000"), BigNum.from_str("3000000000"))
        );

        redeemers.add(redeemer);

        // Tx witness
        const transactionWitnessSet = TransactionWitnessSet.new();

        transactionWitnessSet.set_plutus_scripts(scripts);
        transactionWitnessSet.set_plutus_data(datums);
        transactionWitnessSet.set_redeemers(redeemers);

        const cost_model_vals = [
            197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32,
            2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773,
            100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32,
            150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118,
            0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1,
            136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000,
            32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276,
            1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
            150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1,
            150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1,
            2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0,
            1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000,
            32, 150000, 32, 3345831, 1, 1,
        ];

        const costModel = CostModel.new();
        cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));

        const costModels = Costmdls.new();
        costModels.insert(Language.new_plutus_v1(), costModel);

        const scriptDataHash = hash_script_data(redeemers, costModels, datums);
        txBody.set_script_data_hash(scriptDataHash);

        txBody.set_collateral(inputs);

        const baseAddress = BaseAddress.from_address(shelleyChangeAddress);
        const requiredSigners = Ed25519KeyHashes.new();
        requiredSigners.add(baseAddress.payment_cred().to_keyhash());

        txBody.set_required_signers(requiredSigners);

        const tx = Transaction.new(
            txBody,
            TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
        );

        let txVkeyWitnesses = await this.API.signTx(
            Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
            true
        );
        txVkeyWitnesses = TransactionWitnessSet.from_bytes(
            Buffer.from(txVkeyWitnesses, "hex")
        );

        transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

        const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

        const submittedTxHash = await this.API.submitTx(
            Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
        );
        console.log(submittedTxHash);
        this.setState({ submittedTxHash });
    };

    async componentDidMount() {
        await this.refreshData();
    }

    render() {
        return (
            <div style={{ margin: "20px" }}>
                <div style={{ paddingTop: "10px" }}>
                    <RadioGroup
                        label="Select Wallet:"
                        onChange={this.handleWalletSelect}
                        selectedValue={this.state.whichWalletSelected}
                        inline={true}
                    >
                        <Radio label="Nami" value="nami" />
                        {/* <Radio label="CCvault" value="ccvault" /> */}
                        <Radio label="Flint" value="flint" />
                    </RadioGroup>
                </div>

                <button style={{ padding: "20px" }} onClick={this.refreshData}>
                    Refresh
                </button>

                <p style={{ paddingTop: "20px" }}>
                    <span style={{ fontWeight: "bold" }}>Wallet Found: </span>
                    {`${this.state.walletFound}`}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Wallet Connected: </span>
                    {`${this.state.walletIsEnabled}`}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Wallet API version: </span>
                    {this.state.walletAPIVersion}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Wallet name: </span>
                    {this.state.walletName}
                </p>

                <p>
                    <span style={{ fontWeight: "bold" }}>
                        Network Id (0 = testnet; 1 = mainnet):{" "}
                    </span>
                    {this.state.networkId}
                </p>
                <p style={{ paddingTop: "20px" }}>
                    <span style={{ fontWeight: "bold" }}>
                        UTXOs: (UTXO #txid = ADA amount + AssetAmount + policyId.AssetName +
                        ...):{" "}
                    </span>
                    {this.state.Utxos?.map((x) => (
                        <li
                            style={{ fontSize: "10px" }}
                            key={`${x.str}${x.multiAssetStr}`}
                        >{`${x.str}${x.multiAssetStr}`}</li>
                    ))}
                </p>
                <p style={{ paddingTop: "20px" }}>
                    <span style={{ fontWeight: "bold" }}>Balance: </span>
                    {this.state.balance}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Change Address: </span>
                    {this.state.changeAddress}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Staking Address: </span>
                    {this.state.rewardAddress}
                </p>
                <p>
                    <span style={{ fontWeight: "bold" }}>Used Address: </span>
                    {this.state.usedAddress}
                </p>
                <hr style={{ marginTop: "40px", marginBottom: "40px" }} />

                <Tabs
                    id="TabsExample"
                    vertical={true}
                    onChange={this.handleTabId}
                    selectedTabId={this.state.selectedTabId}
                >
                    <Tab
                        id="1"
                        title="1. Send ADA to Address"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="insert an address where you want to send some ADA ..."
                                    label="Address where to send ADA"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({
                                                addressBech32SendADA: event.target.value,
                                            })
                                        }
                                        value={this.state.addressBech32SendADA}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Adjust Order Amount ..."
                                    label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.lovelaceToSend}
                                        min={1000000}
                                        stepSize={1000000}
                                        majorStepSize={1000000}
                                        onValueChange={(event) =>
                                            this.setState({ lovelaceToSend: event })
                                        }
                                    />
                                </FormGroup>

                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildSendADATransaction}
                                >
                                    Run
                                </button>
                            </div>
                        }
                    />
                    <Tab
                        id="2"
                        title="2. Send Token to Address"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="insert an address where you want to send some ADA ..."
                                    label="Address where to send ADA"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({
                                                addressBech32SendADA: event.target.value,
                                            })
                                        }
                                        value={this.state.addressBech32SendADA}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Make sure you have enough of Asset in your wallet ..."
                                    label="Amount of Assets to Send"
                                    labelFor="asset-amount-input"
                                >
                                    <NumericInput
                                        id="asset-amount-input"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.assetAmountToSend}
                                        min={-10}
                                        stepSize={1}
                                        majorStepSize={1}
                                        onValueChange={(event) =>
                                            this.setState({ assetAmountToSend: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Policy Id"
                                    label="Asset PolicyId"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetPolicyIdHex: event.target.value })
                                        }
                                        value={this.state.assetPolicyIdHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Asset Name"
                                    label="Asset Name"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetNameHex: event.target.value })
                                        }
                                        value={this.state.assetNameHex}
                                    />
                                </FormGroup>

                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildSendTokenTransaction}
                                >
                                    Run
                                </button>
                            </div>
                        }
                    />
                    <Tab
                        id="3"
                        title="3. Send ADA to Plutus Script"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="insert a Script address where you want to send some ADA ..."
                                    label="Script Address where to send ADA"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ addressScriptBech32: event.target.value })
                                        }
                                        value={this.state.addressScriptBech32}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Adjust Order Amount ..."
                                    label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.lovelaceToSend}
                                        min={1000000}
                                        stepSize={1000000}
                                        majorStepSize={1000000}
                                        onValueChange={(event) =>
                                            this.setState({ lovelaceToSend: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="insert a Datum ..."
                                    label="Datum that locks the ADA at the script address ..."
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ datumStr: event.target.value })
                                        }
                                        value={this.state.datumStr}
                                    />
                                </FormGroup>
                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildSendAdaToPlutusScript}
                                >
                                    Run
                                </button>
                            </div>
                        }
                    />
                    <Tab
                        id="4"
                        title="4. Send Token to Plutus Script"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="Script address where ADA is locked ..."
                                    label="Script Address"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ addressScriptBech32: event.target.value })
                                        }
                                        value={this.state.addressScriptBech32}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Need to send ADA with Tokens ..."
                                    label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.lovelaceToSend}
                                        min={1000000}
                                        stepSize={1000000}
                                        majorStepSize={1000000}
                                        onValueChange={(event) =>
                                            this.setState({ lovelaceToSend: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Make sure you have enough of Asset in your wallet ..."
                                    label="Amount of Assets to Send"
                                    labelFor="asset-amount-input"
                                >
                                    <NumericInput
                                        id="asset-amount-input"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.assetAmountToSend}
                                        min={1}
                                        stepSize={1}
                                        majorStepSize={1}
                                        onValueChange={(event) =>
                                            this.setState({ assetAmountToSend: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Policy Id"
                                    label="Asset PolicyId"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetPolicyIdHex: event.target.value })
                                        }
                                        value={this.state.assetPolicyIdHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Asset Name"
                                    label="Asset Name"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetNameHex: event.target.value })
                                        }
                                        value={this.state.assetNameHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="insert a Datum ..."
                                    label="Datum that locks the ADA at the script address ..."
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ datumStr: event.target.value })
                                        }
                                        value={this.state.datumStr}
                                    />
                                </FormGroup>
                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildSendTokenToPlutusScript}
                                >
                                    Run
                                </button>
                            </div>
                        }
                    />
                    <Tab
                        id="5"
                        title="5. Redeem ADA from Plutus Script"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="Script address where ADA is locked ..."
                                    label="Script Address"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ addressScriptBech32: event.target.value })
                                        }
                                        value={this.state.addressScriptBech32}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="content of the plutus script encoded as CborHex ..."
                                    label="Plutus Script CborHex"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ plutusScriptCborHex: event.target.value })
                                        }
                                        value={this.state.plutusScriptCborHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Transaction hash ... If empty then run n. 3 first to lock some ADA"
                                    label="UTXO where ADA is locked"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ transactionIdLocked: event.target.value })
                                        }
                                        value={this.state.transactionIdLocked}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="UTXO IndexId#, usually it's 0 ..."
                                    label="Transaction Index #"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.transactionIndxLocked}
                                        min={0}
                                        stepSize={1}
                                        majorStepSize={1}
                                        onValueChange={(event) =>
                                            this.setState({ transactionIndxLocked: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Adjust Order Amount ..."
                                    label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.lovelaceLocked}
                                        min={1000000}
                                        stepSize={1000000}
                                        majorStepSize={1000000}
                                        onValueChange={(event) =>
                                            this.setState({ lovelaceLocked: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="insert a Datum ..."
                                    label="Datum that unlocks the ADA at the script address ..."
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ datumStr: event.target.value })
                                        }
                                        value={this.state.datumStr}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Needs to be enough to execute the contract ..."
                                    label="Manual Fee"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.manualFee}
                                        min={160000}
                                        stepSize={100000}
                                        majorStepSize={100000}
                                        onValueChange={(event) =>
                                            this.setState({ manualFee: event })
                                        }
                                    />
                                </FormGroup>
                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildRedeemAdaFromPlutusScript}
                                >
                                    Run
                                </button>
                                {/*<button style={{padding: "10px"}} onClick={this.signTransaction}>2. Sign Transaction</button>*/}
                                {/*<button style={{padding: "10px"}} onClick={this.submitTransaction}>3. Submit Transaction</button>*/}
                            </div>
                        }
                    />
                    <Tab
                        id="6"
                        title="6. Redeem Tokens from Plutus Script"
                        panel={
                            <div style={{ marginLeft: "20px" }}>
                                <FormGroup
                                    helperText="Script address where ADA is locked ..."
                                    label="Script Address"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ addressScriptBech32: event.target.value })
                                        }
                                        value={this.state.addressScriptBech32}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="content of the plutus script encoded as CborHex ..."
                                    label="Plutus Script CborHex"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ plutusScriptCborHex: event.target.value })
                                        }
                                        value={this.state.plutusScriptCborHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Transaction hash ... If empty then run n. 3 first to lock some ADA"
                                    label="UTXO where ADA is locked"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ transactionIdLocked: event.target.value })
                                        }
                                        value={this.state.transactionIdLocked}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="UTXO IndexId#, usually it's 0 ..."
                                    label="Transaction Index #"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.transactionIndxLocked}
                                        min={0}
                                        stepSize={1}
                                        majorStepSize={1}
                                        onValueChange={(event) =>
                                            this.setState({ transactionIndxLocked: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Adjust Order Amount ..."
                                    label="Lovelaces (1 000 000 lovelaces = 1 ADA)"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.lovelaceLocked}
                                        min={1000000}
                                        stepSize={1000000}
                                        majorStepSize={1000000}
                                        onValueChange={(event) =>
                                            this.setState({ lovelaceLocked: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Make sure you have enough of Asset in your wallet ..."
                                    label="Amount of Assets to Reedem"
                                    labelFor="asset-amount-input"
                                >
                                    <NumericInput
                                        id="asset-amount-input"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.assetAmountToSend}
                                        min={1}
                                        stepSize={1}
                                        majorStepSize={1}
                                        onValueChange={(event) =>
                                            this.setState({ assetAmountToSend: event })
                                        }
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Policy Id"
                                    label="Asset PolicyId"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetPolicyIdHex: event.target.value })
                                        }
                                        value={this.state.assetPolicyIdHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Hex of the Asset Name"
                                    label="Asset Name"
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ assetNameHex: event.target.value })
                                        }
                                        value={this.state.assetNameHex}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="insert a Datum ..."
                                    label="Datum that unlocks the ADA at the script address ..."
                                >
                                    <InputGroup
                                        disabled={false}
                                        leftIcon="id-number"
                                        onChange={(event) =>
                                            this.setState({ datumStr: event.target.value })
                                        }
                                        value={this.state.datumStr}
                                    />
                                </FormGroup>
                                <FormGroup
                                    helperText="Needs to be enough to execute the contract ..."
                                    label="Manual Fee"
                                    labelFor="order-amount-input2"
                                >
                                    <NumericInput
                                        id="order-amount-input2"
                                        disabled={false}
                                        leftIcon={"variable"}
                                        allowNumericCharactersOnly={true}
                                        value={this.state.manualFee}
                                        min={160000}
                                        stepSize={100000}
                                        majorStepSize={100000}
                                        onValueChange={(event) =>
                                            this.setState({ manualFee: event })
                                        }
                                    />
                                </FormGroup>
                                <button
                                    style={{ padding: "10px" }}
                                    onClick={this.buildRedeemTokenFromPlutusScript}
                                >
                                    Run
                                </button>
                            </div>
                        }
                    />
                    <Tabs.Expander />
                </Tabs>

                <hr style={{ marginTop: "40px", marginBottom: "40px" }} />

                {/*<p>{`Unsigned txBodyCborHex: ${this.state.txBodyCborHex_unsigned}`}</p>*/}
                {/*<p>{`Signed txBodyCborHex: ${this.state.txBodyCborHex_signed}`}</p>*/}
                <p>{`Submitted Tx Hash: ${this.state.submittedTxHash}`}</p>
                <p>{this.state.submittedTxHash ? "check your wallet !" : ""}</p>
            </div>
        );
    }
}
