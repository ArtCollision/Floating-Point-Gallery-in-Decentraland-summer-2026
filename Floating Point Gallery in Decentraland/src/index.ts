import { engine, Transform, VideoPlayer, Material, MeshRenderer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { EntityNames } from '../assets/scene/entity-names'

const SPATIAL_MIN_DISTANCE = 4
const SPATIAL_MAX_DISTANCE = 12

export function main() {
  // uncomment the line below to initialize UI from ui.tsx
  //setupUi()

  setupScreenDome()
  setupTriptychScreens()
}

function setupScreenDome() {
  const dome = engine.getEntityOrNullByName(EntityNames.Screen_Dome)
  if (!dome) return

  VideoPlayer.createOrReplace(dome, {
    src: 'assets/video present.mp4',
    playing: true,
    loop: true,
    volume: 1,
    spatial: true,
    spatialMinDistance: SPATIAL_MIN_DISTANCE,
    spatialMaxDistance: SPATIAL_MAX_DISTANCE
  })
}

interface TriptychScreen {
  src: string
  position: Vector3
}

// Left to right, as seen by a player facing the wall
const TRIPTYCH_SCREENS: TriptychScreen[] = [
  { src: 'assets/video past.mp4', position: Vector3.create(3, 1.75, 15.5) },
  { src: 'assets/video present.mp4', position: Vector3.create(8, 1.75, 15.5) },
  { src: 'assets/video future.mp4', position: Vector3.create(13, 1.75, 15.5) }
]

function setupTriptychScreens() {
  for (const screen of TRIPTYCH_SCREENS) {
    const entity = engine.addEntity()
    Transform.create(entity, {
      position: screen.position,
      scale: Vector3.create(2.5, 3.5, 1)
    })
    MeshRenderer.setPlane(entity)

    VideoPlayer.create(entity, {
      src: screen.src,
      playing: true,
      loop: true,
      volume: 1,
      spatial: true,
      spatialMinDistance: SPATIAL_MIN_DISTANCE,
      spatialMaxDistance: SPATIAL_MAX_DISTANCE
    })

    const videoTexture = Material.Texture.Video({ videoPlayerEntity: entity })
    Material.setBasicMaterial(entity, { texture: videoTexture })
  }
}
