export const requestEthereumAccounts = async (): Promise<Array<string>> => {
  if (typeof window === 'undefined') {
    throw new Error(`Cannot access window. It's necessary`)
  }
  if (!(window as any).ethereum) {
    throw new Error('No window.ethereum found')
  }
  let accounts: string[] = []
  try {
    accounts = await (window as any).ethereum.request({method: 'eth_requestAccounts'})
  } catch (err: any) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      throw new Error('User rejected')
    }
    throw err
  }
  return accounts
}

interface ISafeGetAccountsResult {
  extensionFound: boolean
  accounts: string[]
}

export const safeGetAccounts = async (): Promise<ISafeGetAccountsResult> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return {extensionFound: false, accounts: []}
  }

  const accounts: string[] = await (window as any).ethereum.request({method: 'eth_accounts'})
  return {extensionFound: true, accounts}
}

export const connectToMetamask = async (): Promise<string[]> => {
  let getAccountsResult = await safeGetAccounts()
  if (!getAccountsResult.extensionFound) {
    return []
  }
  if (getAccountsResult.accounts.length) {
    return getAccountsResult.accounts
  } else {
    return await requestEthereumAccounts()
  }
}
