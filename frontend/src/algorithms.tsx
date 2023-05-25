import { useLocation } from 'react-router'

export const ALGORITHM_ROUTES: Array<{ title: string, href: string, description: string }> = [
  {
    title: 'Progressively Energetic',
    href: '/a/progressively_energetic',
    description: 'Pick an artist. Generate a playlist of songs related to that artist. The songs will start mellow and end with lots of energy.'
  }
]

export const useAlgorithmRoute = () => {
  const location = useLocation()
  console.log(location)

  return ALGORITHM_ROUTES[0]
}
