import type { ActorInput } from './types'

const P0 = { MID: false, EI: false, M2M_SE: false, LCH: false, CSD: false }

export const ACTORS: ActorInput[] = [
  // REINSURANCE — scaleProxy based on gross written premium / market position
  { actor_id: 'munich-re', actor_name: 'Munich Re', slug: 'munich-re', sector: 'REINSURANCE', scaleProxy: 88, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'swiss-re', actor_name: 'Swiss Re', slug: 'swiss-re', sector: 'REINSURANCE', scaleProxy: 85, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'berkshire-re', actor_name: 'Berkshire Hathaway Re', slug: 'berkshire-re', sector: 'REINSURANCE', scaleProxy: 87, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'hannover-re', actor_name: 'Hannover Re', slug: 'hannover-re', sector: 'REINSURANCE', scaleProxy: 76, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'scor', actor_name: 'SCOR', slug: 'scor', sector: 'REINSURANCE', scaleProxy: 72, proof_handle: null, primitives: { ...P0 } },

  // AI_LABS — scaleProxy based on compute scale / deployment footprint
  { actor_id: 'openai', actor_name: 'OpenAI', slug: 'openai', sector: 'AI_LABS', scaleProxy: 90, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'google-deepmind', actor_name: 'Google DeepMind', slug: 'google-deepmind', sector: 'AI_LABS', scaleProxy: 86, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'anthropic', actor_name: 'Anthropic', slug: 'anthropic', sector: 'AI_LABS', scaleProxy: 82, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'meta-ai', actor_name: 'Meta AI', slug: 'meta-ai', sector: 'AI_LABS', scaleProxy: 84, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'xai', actor_name: 'xAI', slug: 'xai', sector: 'AI_LABS', scaleProxy: 78, proof_handle: null, primitives: { ...P0 } },

  // CLOUD — scaleProxy based on global compute market share
  { actor_id: 'aws', actor_name: 'AWS', slug: 'aws', sector: 'CLOUD', scaleProxy: 90, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'microsoft-azure', actor_name: 'Microsoft Azure', slug: 'microsoft-azure', sector: 'CLOUD', scaleProxy: 89, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'google-cloud', actor_name: 'Google Cloud', slug: 'google-cloud', sector: 'CLOUD', scaleProxy: 83, proof_handle: null, primitives: { ...P0 } },

  // ROBOTICS — scaleProxy based on deployed unit count / actuation footprint
  { actor_id: 'tesla-optimus', actor_name: 'Tesla Optimus', slug: 'tesla-optimus', sector: 'ROBOTICS', scaleProxy: 81, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'amazon-robotics', actor_name: 'Amazon Robotics', slug: 'amazon-robotics', sector: 'ROBOTICS', scaleProxy: 80, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'boston-dynamics', actor_name: 'Boston Dynamics', slug: 'boston-dynamics', sector: 'ROBOTICS', scaleProxy: 74, proof_handle: null, primitives: { ...P0 } },
  { actor_id: 'figure-ai', actor_name: 'Figure AI', slug: 'figure-ai', sector: 'ROBOTICS', scaleProxy: 66, proof_handle: null, primitives: { ...P0 } },
]
