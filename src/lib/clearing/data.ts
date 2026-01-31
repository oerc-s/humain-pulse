import type { ActorInput } from './types'

const P0 = { MID: 0 as const, M2M_SE: 0 as const, LCH: 0 as const, CSD: 0 as const }

export const ACTORS: ActorInput[] = [
  // REINSURANCE
  { actor_id: 'munich-re', actor_name: 'Munich Re', slug: 'munich-re', sector: 'REINSURANCE', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'swiss-re', actor_name: 'Swiss Re', slug: 'swiss-re', sector: 'REINSURANCE', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'berkshire-re', actor_name: 'Berkshire Hathaway Re', slug: 'berkshire-re', sector: 'REINSURANCE', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'hannover-re', actor_name: 'Hannover Re', slug: 'hannover-re', sector: 'REINSURANCE', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 2, proof_handle: 'not_declared' },
  { actor_id: 'scor', actor_name: 'SCOR', slug: 'scor', sector: 'REINSURANCE', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 1, proof_handle: 'not_declared' },

  // AI_LABS
  { actor_id: 'openai', actor_name: 'OpenAI', slug: 'openai', sector: 'AI_LABS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'google-deepmind', actor_name: 'Google DeepMind', slug: 'google-deepmind', sector: 'AI_LABS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'meta-ai', actor_name: 'Meta AI', slug: 'meta-ai', sector: 'AI_LABS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'anthropic', actor_name: 'Anthropic', slug: 'anthropic', sector: 'AI_LABS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 2, proof_handle: 'not_declared' },
  { actor_id: 'xai', actor_name: 'xAI', slug: 'xai', sector: 'AI_LABS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 1, proof_handle: 'not_declared' },

  // CLOUD
  { actor_id: 'aws', actor_name: 'AWS', slug: 'aws', sector: 'CLOUD', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'microsoft-azure', actor_name: 'Microsoft Azure', slug: 'microsoft-azure', sector: 'CLOUD', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'google-cloud', actor_name: 'Google Cloud', slug: 'google-cloud', sector: 'CLOUD', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },

  // ROBOTICS
  { actor_id: 'amazon-robotics', actor_name: 'Amazon Robotics', slug: 'amazon-robotics', sector: 'ROBOTICS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 3, proof_handle: 'not_declared' },
  { actor_id: 'tesla-optimus', actor_name: 'Tesla Optimus', slug: 'tesla-optimus', sector: 'ROBOTICS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 2, proof_handle: 'not_declared' },
  { actor_id: 'boston-dynamics', actor_name: 'Boston Dynamics', slug: 'boston-dynamics', sector: 'ROBOTICS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 1, proof_handle: 'not_declared' },
  { actor_id: 'figure-ai', actor_name: 'Figure AI', slug: 'figure-ai', sector: 'ROBOTICS', primitives: { ...P0 }, proof_strength: 0, scale_proxy: 1, proof_handle: 'not_declared' },
]
