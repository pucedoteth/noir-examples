import { Noir } from '@noir-lang/noir_js';
import type { ProofData } from '@aztec/bb.js';
import { useState } from 'react';
import type { CompiledCircuit } from '@noir-lang/noir_js';
import stealthdropCircuit from '../../../noir/target/stealthdrop.json' with { type: 'json' };

export function useProver() {
  const [proof, setProof] = useState<ProofData>();
  const [status, setStatus] = useState<'executing' | 'proving' | 'success' | 'error' | 'idle'>(
    'idle',
  );

  const prove = async (inputs: any) => {
    const start = performance.now();
    setStatus('executing');
    const { UltraHonkBackend } = await import('@aztec/bb.js');

    // @ts-ignore
    const backend = new UltraHonkBackend(stealthdropCircuit.bytecode);
    const noir = new Noir(stealthdropCircuit as unknown as CompiledCircuit);

    const initializationTime = performance.now() - start;
    console.log(`Initialization time: ${initializationTime}ms`);
    const { witness } = await noir.execute(inputs);
    const witnessTime = performance.now() - initializationTime;
    console.log(`Witness generation time: ${witnessTime}ms`);
    setStatus('proving');
    const proof = await backend.generateProof(witness, { keccak: true });
    proof.proof = proof.proof.slice(4);
    const provingTime = performance.now() - witnessTime;
    console.log(`Proving time: ${provingTime}ms`);
    setStatus('success');

    const totalTime = performance.now() - start;
    console.log(`Total time: ${totalTime}ms`);

    setProof(proof);
  };

  return { prove, proof, status, setStatus, setProof };
}
