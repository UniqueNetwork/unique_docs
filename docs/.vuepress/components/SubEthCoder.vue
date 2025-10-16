<template>
  <div class="sub-eth-coder">
    <div class="input-container">
      <UniqueInput
        v-model="inputRef"
        class="input"
        placeholder="Input an address"
        @keyup.enter="convertInputSubToEth"
      />
      <UniqueButton color="blue" @click="convertInputSubToEth"
        >Convert</UniqueButton
      >
    </div>

    <transition name="fade">
      <div v-if="error.message" class="error-message">
        {{ error.message }}
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="converted.toSubNormalized" class="results">
        <div v-if="converted.sourceEth" class="source-warning">
          <div class="address-card highlight">
            <div class="address-label">Source Ethereum Address</div>
            <div class="address-value">
              <CopyButton :data="converted.sourceEth" />
              <span>{{ converted.sourceEth }}</span>
            </div>
          </div>
          <div class="warning-badge">
            All addresses below are substrate mirrors of this ethereum address
          </div>
        </div>

        <div class="addresses-section">
          <h3 class="section-title">Primary Formats</h3>

          <div class="address-card">
            <div class="address-label">Normalized Format (prefix 42)</div>
            <div class="address-value">
              <CopyButton :data="converted.toSubNormalized" />
              <span>{{ converted.toSubNormalized }}</span>
            </div>
          </div>

          <div class="address-card">
            <div class="address-label">Unique Format (prefix 7391)</div>
            <div class="address-value">
              <CopyButton :data="converted.toUnique" />
              <span>{{ converted.toUnique }}</span>
            </div>
          </div>

          <div class="address-card">
            <div class="address-label">Ethereum Mirror</div>
            <div class="address-value">
              <CopyButton :data="converted.toEth" />
              <span>{{ converted.toEth }}</span>
            </div>
            <div v-if="converted.sourceEth" class="address-note">
              Please note: this address is a <strong>double</strong> mirror, not
              the original Ethereum address
            </div>
          </div>

          <div class="address-card">
            <div class="address-label">Substrate Address Public Key</div>
            <div class="address-value">
              <CopyButton :data="converted.toSubstratePublicKey" />
              <span class="public-key">{{
                converted.toSubstratePublicKey
              }}</span>
            </div>
          </div>
        </div>

        <div class="addresses-section">
          <h3 class="section-title">Additional Formats</h3>

          <div class="address-card">
            <div class="address-label">Polkadot</div>
            <div class="address-value">
              <CopyButton :data="converted.toPolkadot" />
              <span>{{ converted.toPolkadot }}</span>
            </div>
          </div>

          <div class="address-card">
            <div class="address-label">Kusama</div>
            <div class="address-value">
              <CopyButton :data="converted.toKusama" />
              <span>{{ converted.toKusama }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import CopyButton from "./CopyButton.vue";
import UniqueButton from "../components/UI/UniqueButton.vue";
import UniqueInput from "../components/UI/UniqueInput.vue";

import { Address } from "@unique-nft/utils/";

const inputRef = ref("");
const converted = reactive({
  sourceEth: "",
  address: "",
  toSub: "",
  toUnique: "",
  toKusama: "",
  toPolkadot: "",
  toEth: "",
  toSubNormalized: "",
  toSubstratePublicKey: "",
});

const error = reactive({
  message: "",
});

const convertInputSubToEth = async () => {
  let rawAddress = inputRef.value;
  console.log("rawAddress", rawAddress);

  error.message = "";

  converted.sourceEth = "";
  if (Address.is.substrateAddress(rawAddress)) {
  } else if (Address.is.ethereumAddress(rawAddress)) {
    converted.sourceEth = rawAddress;
    rawAddress = Address.mirror.ethereumToSubstrate(rawAddress);
  } else {
    error.message = `Address "${rawAddress}" is not valid`;
    return;
  }

  converted.toEth = Address.mirror.substrateToEthereum(rawAddress);
  converted.toUnique = Address.normalize.substrateAddress(rawAddress, 7391);
  converted.toPolkadot = Address.normalize.substrateAddress(rawAddress, 0);
  converted.toKusama = Address.normalize.substrateAddress(rawAddress, 2);
  converted.toSubNormalized = Address.normalize.substrateAddress(rawAddress);
  converted.toSubstratePublicKey = Address.substrate.decode(rawAddress).hex;
};
</script>

<style lang="scss" scoped>
.sub-eth-coder {
  max-width: 100%;
  margin: 0 auto;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: stretch;

  .input {
    flex: 1;
    max-width: 600px;
    font-family: "Courier New", monospace;
    font-size: 1rem;
  }
}

.error-message {
  background: var(--c-danger-bg, #fee);
  color: var(--c-danger, #c33);
  padding: 0.875rem 1.125rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--c-danger, #c33);
  font-weight: 500;
}

.results {
  margin-top: 2rem;
}

.source-warning {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--c-warning-bg, #fff8e1);
  border-radius: 12px;
  border: 1px solid var(--c-warning-border, #ffd54f);

  .warning-badge {
    margin-top: 1rem;
    padding: 0.625rem 1rem;
    background: var(--c-warning-badge-bg, rgba(255, 152, 0, 0.15));
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    color: var(--c-warning-text, #e65100);
    font-size: 0.9rem;
  }
}

.addresses-section {
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--c-text, #2c3e50);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--c-border, #e0e0e0);
}

.address-card {
  background: var(--c-bg-light, #ffffff);
  border: 1px solid var(--c-border, #e0e0e0);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--c-shadow, rgba(0, 0, 0, 0.1));
    border-color: var(--c-border-dark, #b0b0b0);
  }

  &.highlight {
    background: var(--c-bg-accent, #f5f9ff);
    border-color: var(--c-brand-light, #90caf9);
  }

  &.compact {
    padding: 1rem 1.25rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.address-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-lighter, #546e7a);
  margin-bottom: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.address-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: "Courier New", monospace;
  font-size: 0.95rem;
  word-break: break-all;
  color: var(--c-text, #1a1a1a);
  line-height: 1.6;

  span {
    flex: 1;
  }

  .public-key {
    font-size: 0.85rem;
    color: var(--c-text-light, #424242);
  }
}

.address-note {
  margin-top: 0.75rem;
  padding: 0.625rem 1rem;
  background: var(--c-warning-note-bg, rgba(255, 193, 7, 0.1));
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--c-warning-text, #f57c00);
  font-style: italic;
  border-left: 3px solid var(--c-warning-border, #ffa726);

  strong {
    font-weight: 700;
    color: var(--c-warning-strong, #e65100);
  }
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

// Responsive design
@media (max-width: 768px) {
  .input-container {
    flex-wrap: wrap;

    .input {
      min-width: 200px;
      max-width: 100%;
    }
  }

  .address-card {
    padding: 1rem;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }

  .source-warning {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .input-container {
    flex-direction: column;

    .input {
      width: 100%;
      max-width: 100%;
    }
  }

  .address-value {
    font-size: 0.825rem;
  }

  .address-label {
    font-size: 0.8rem;
  }
}
</style>
