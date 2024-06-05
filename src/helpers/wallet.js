import detectEthereumProvider from "@metamask/detect-provider"
import { ENVS } from "./configurations/index"

export const connectWallet = async () => {
    const provider = await detectEthereumProvider()

    if (provider) {
        try {
            const walletChainId = await provider.request({
                method: "eth_chainId",
            })

            if (walletChainId === `0x${parseInt(ENVS.CHAIN_ID).toString(16)}`) {
                const addressArray = await provider.request({
                    method: "eth_requestAccounts",
                })

                if (addressArray.length) {
                    return {
                        address: addressArray[0],
                        status: "Connected",
                    }
                } else {
                    return {
                        address: "",
                        status: "No wallet connected",
                    }
                }
            } else {
                provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: `0x${parseInt(ENVS.CHAIN_ID).toString(16)}` }],
                })

                return {
                    address: "",
                    status: "Switching to the correct network...",
                }
            }
        } catch (err) {
            return {
                address: "",
                status: `😥 ${err.message}`,
            }
        }
    } else {
        console.log(`🦊 You must install Metamask, a virtual Ethereum wallet, in your
            browser.(https://metamask.io/download.html)`)
        return {
            address: "",
            status: "Can't find web3 provider",
        }
    }
}

export const getCurrentWalletConnected = async () => {
    const provider = await detectEthereumProvider()

    if (provider) {
        try {
            const addressArray = await provider.request({
                method: "eth_accounts",
            })
            const walletChainId = await provider.request({
                method: "eth_chainId",
            })
            if (addressArray.length && walletChainId === `0x${parseInt(ENVS.CHAIN_ID).toString(16)}`) {
                return {
                    address: addressArray[0],
                    status: "Connected to the correct network",
                }
            } else {
                return {
                    address: "",
                    status: "Connect Metamask to the correct network",
                }
            }
        } catch (err) {
            return {
                address: "",
                status: `😥 ${err.message}`,
            }
        }
    } else {
        console.log(`🦊 You must install Metamask, a virtual Ethereum wallet, in your
            browser.(https://metamask.io/download.html)`)
        return {
            address: "",
            status: "Can't find web3 provider",
        }
    }
}
