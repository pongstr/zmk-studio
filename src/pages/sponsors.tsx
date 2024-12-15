import { FC, useEffect, useState } from 'react'

import { SponsorsType } from '@/types'

const SponsorsPage: FC = () => {
  const [sponsors, setSponsors] = useState<Array<SponsorsType>>([])

  useEffect(() => {
    if (sponsors.length !== 0) return

    fetch('/data/sponsors.json', {
      mode: 'same-origin',
      method: 'GET',
    })
      .then((res) => res.json())
      .then(setSponsors)
      .catch(console.error)
  }, [sponsors])

  return <div></div>
}

export default SponsorsPage
