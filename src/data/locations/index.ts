import type { Location } from '../../types'
import { VILLAGE_LOCATION } from './village'
import { FOREST_LOCATION } from './forest'
import { TEMPLE_LOCATION } from './temple'

export const LOCATIONS: Record<string, Location> = {
  zone_village:      VILLAGE_LOCATION,
  zone_forest:       FOREST_LOCATION,
  zone_temple_ruins: TEMPLE_LOCATION,
}

export const STARTING_LOCATION = 'zone_village'

export { VILLAGE_LOCATION, FOREST_LOCATION, TEMPLE_LOCATION }
