import { Search } from 'lucide-react'
import React, { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [q, setQ] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    const val = q.trim().toLowerCase()
    if (onSearch) onSearch(val)
  }

  return (
    <form onSubmit={onSubmit} className='relative w-full max-w-md'>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          type="text"
          name="q"
          id="q"
          placeholder='Search Pokemon by name or ID...'
          className='search h-11 pl-10 w-full rounded-xl bg-secondary/50 border-border/50 focus:bg-background  transition-colors'
        />
      </div>
    </form>
  )
}

export default SearchBar
