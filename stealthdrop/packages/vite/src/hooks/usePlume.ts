import { useCallback, useState } from 'react';
import { computeAllInputs } from 'plume-sig';
import { MESSAGE_TO_HASH } from '../../../../utils/const.ts';
import { type PlumeSignature } from '../../../../types.ts';
import eligible from '../../../../utils/mt/eligible.json' with { type: 'json' };

export function usePlume() {
  const [plume, setPlume] = useState<PlumeSignature>();

  const generatePlume = useCallback(async (address: `0x${string}`) => {
    const { privateKey, publicKey } = eligible.find((a: any) => a.address === address) || {};

    if (!privateKey) {
      throw new Error('Private key not found');
    }

    const messageBytes = MESSAGE_TO_HASH.split('').map((s: string, i: number) =>
      MESSAGE_TO_HASH.charCodeAt(i),
    );
    const plume = await computeAllInputs(Uint8Array.from(messageBytes), privateKey);

    setPlume({
      nullifier: plume.nullifier,
      c: plume.c,
      s: plume.s,
      uncompressedPublicKey: publicKey as `0x${string}`,
    });
  }, []);

  const resetPlume = useCallback(() => {
    setPlume(undefined);
  }, []);

  return {
    plume,
    generatePlume,
    resetPlume,
  };
}
