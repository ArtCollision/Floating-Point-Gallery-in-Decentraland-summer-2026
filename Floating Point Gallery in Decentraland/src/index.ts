import { engine, Transform, AudioSource, pointerEventsSystem, InputAction, Entity } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { EntityNames } from '../assets/scene/entity-names'

const GEM_SOUND = 'assets/Audio/resolve.mp3'
const GEM_REST_SCALE = 0.6
const GEM_BASE_Y = 1.4

let pulsing = false
let pulseT = 0
let angle = 0

export function main() {
  // uncomment the line below to initialize UI from ui.tsx
  //setupUi()

  setupGem()
}

function setupGem() {
  const gem = engine.getEntityOrNullByName(EntityNames.Blue_Gem)
  if (!gem) return

  pointerEventsSystem.onPointerDown(
    { entity: gem, opts: { button: InputAction.IA_POINTER, hoverText: 'Touch gem' } },
    () => {
      AudioSource.playSound(gem, GEM_SOUND)
      pulsing = true
      pulseT = 0
    }
  )

  engine.addSystem((dt: number) => animateGem(gem, dt))
}

function animateGem(gem: Entity, dt: number) {
  const transform = Transform.getMutable(gem)

  angle += dt * 60
  transform.rotation = Quaternion.fromEulerDegrees(0, angle, 0)

  const bob = Math.sin(Date.now() / 600) * 0.12
  transform.position = Vector3.create(transform.position.x, GEM_BASE_Y + bob, transform.position.z)

  if (pulsing) {
    pulseT += dt
    const s = GEM_REST_SCALE * (1 + 0.5 * Math.sin(pulseT * 12) * Math.exp(-pulseT * 2))
    transform.scale = Vector3.create(s, s, s)
    if (pulseT > 1.5) {
      pulsing = false
      transform.scale = Vector3.create(GEM_REST_SCALE, GEM_REST_SCALE, GEM_REST_SCALE)
    }
  }
}
