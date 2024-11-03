require("dotenv").config();
const { TonClient } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");

async function verifyConfiguration() {
  console.log("🔍 Verifying configuration...\n");

  // Check TON_ENDPOINT
  try {
    console.log("Testing TON_ENDPOINT connection...");
    const client = new TonClient({
      endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });

    // Get blockchain info using the correct API method
    const { last } = await client.getLastBlock();
    console.log("✅ TON_ENDPOINT connection successful!");
    console.log(`   Connected to network\n`);
  } catch (error) {
    console.error("❌ TON_ENDPOINT connection failed!");
    console.error(`   Error: ${error.message}`);
    console.log("\n💡 Possible solutions:");
    console.log("   1. Check if your TON_ENDPOINT URL is correct");
    console.log("   2. Ensure you have internet connectivity");
    console.log("   3. Try using an API key if rate limited\n");
    return;
  }

  // Check CONTRACT_MNEMONIC
  try {
    console.log("Verifying CONTRACT_MNEMONIC...");
    const mnemonicWords = process.env.CONTRACT_MNEMONIC.split(" ");

    if (mnemonicWords.length !== 24) {
      throw new Error(`Expected 24 words but got ${mnemonicWords.length}`);
    }

    // Try to derive keys from mnemonic
    const key = await mnemonicToPrivateKey(mnemonicWords);
    console.log("✅ CONTRACT_MNEMONIC is valid!");
    console.log(
      `   Public Key: ${Buffer.from(key.publicKey).toString("hex")}\n`
    );

    // Create wallet address for reference
    const { WalletContractV4 } = require("@ton/ton");
    const wallet = WalletContractV4.create({
      publicKey: key.publicKey,
      workchain: 0,
    });
    console.log("🏦 Wallet Information:");
    console.log(`   Address: ${wallet.address.toString()}`);
    console.log("   (You can use this address to receive test tokens)\n");
  } catch (error) {
    console.error("❌ CONTRACT_MNEMONIC validation failed!");
    console.error(`   Error: ${error.message}\n`);
    return;
  }

  console.log("✨ Configuration verification completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Get test tokens from https://t.me/testgiver_ton_bot");
  console.log("2. Check your balance before running the main application");
}

// Add proper error handling for the entire script
(async () => {
  try {
    await verifyConfiguration();
  } catch (error) {
    console.error("\n❌ Unexpected error during verification:");
    console.error(error);
    process.exit(1);
  }
})();
