import React, { useState, useEffect, useRef } from 'react'
import SnapshotItem from './SnapshotItem'

interface Tab {
  url: string
  title: string
  pinned: boolean
}

interface Snapshot {
  id: string
  timestamp: string
  tabs: Tab[]
}

interface Settings {
  interval: number
}

const App: React.FC = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [settings, setSettings] = useState<Settings>({ interval: 5 })
  const [interval, setInterval] = useState<string>('5')
  const [expandedSnapshots, setExpandedSnapshots] = useState<Set<string>>(new Set())
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [timeSpan, setTimeSpan] = useState<string>('Coverage: ~8 hours')
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSettings()
    loadSnapshots()
  }, [])

  const loadSettings = () => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (settings: Settings) => {
      const intervalValue = settings.interval || 5
      setSettings(settings)
      setInterval(intervalValue.toString())
      updateTimeSpan(intervalValue)
    })
  }

  const loadSnapshots = () => {
    chrome.runtime.sendMessage({ action: 'getSnapshots' }, (snapshots: Snapshot[]) => {
      setSnapshots(snapshots || [])
    })
  }

  const handleSaveSnapshot = () => {
    chrome.runtime.sendMessage({ action: 'saveSnapshot' })
    setTimeout(loadSnapshots, 100)
  }

  const handleIntervalChange = (value: string) => {
    setInterval(value)
    const intervalValue = parseInt(value)
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    hideError()
    
    if (!value || value.trim() === '') {
      return
    }
    
    if (isNaN(intervalValue) || intervalValue < 1 || intervalValue > 60) {
      showError('Please enter a number between 1 and 60')
      return
    }
    
    updateTimeSpan(intervalValue)
    
    saveTimeoutRef.current = setTimeout(() => {
      chrome.runtime.sendMessage({
        action: 'updateInterval',
        interval: intervalValue
      })
    }, 1000)
  }

  const updateTimeSpan = (interval: number) => {
    const maxSnapshots = 100
    const totalMinutes = interval * maxSnapshots
    const totalHours = totalMinutes / 60
    const totalDays = totalHours / 24
    const totalWeeks = totalDays / 7
    
    let timeSpanText
    if (totalMinutes < 60) {
      timeSpanText = `${totalMinutes} minutes`
    } else if (totalHours < 24) {
      timeSpanText = `${Math.round(totalHours)} hours`
    } else if (totalDays < 7) {
      timeSpanText = `${Math.round(totalDays)} days`
    } else {
      timeSpanText = `${Math.round(totalWeeks)} weeks`
    }
    
    setTimeSpan(`Coverage: ~${timeSpanText}`)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
  }

  const hideError = () => {
    setErrorMessage('')
  }

  const toggleSnapshot = (snapshotId: string) => {
    setExpandedSnapshots(prev => {
      // If clicking on already expanded snapshot, close it
      if (prev.has(snapshotId)) {
        return new Set()
      } else {
        // Open only this snapshot, close all others (accordion behavior)
        const newSet = new Set([snapshotId])
        
        // Auto-scroll to the snapshot header after state update
        setTimeout(() => {
          const snapshotElement = document.querySelector(`[data-snapshot-id="${snapshotId}"]`)
          if (snapshotElement) {
            snapshotElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 50) // Small delay to ensure DOM is updated
        
        return newSet
      }
    })
  }

  const handleTabClick = (url: string) => {
    chrome.tabs.create({ url })
  }

  const handleRestoreSnapshot = (snapshotId: string, closeExisting: boolean) => {
    chrome.runtime.sendMessage({
      action: 'restoreSnapshot',
      snapshotId,
      closeExisting
    })
  }

  const handleDeleteSnapshot = (snapshotId: string) => {
    if (confirm('Are you sure you want to delete this snapshot?')) {
      chrome.runtime.sendMessage(
        { action: 'deleteSnapshot', snapshotId },
        (response: { success: boolean; error?: string }) => {
          if (response && response.success) {
            loadSnapshots()
          } else {
            console.error('Delete failed:', response ? response.error : 'No response')
          }
        }
      )
    }
  }

  const handleDeleteOlderSnapshots = (snapshotId: string) => {
    if (confirm('Are you sure you want to delete this snapshot and all older snapshots?')) {
      chrome.runtime.sendMessage(
        { action: 'deleteOlderSnapshots', snapshotId },
        (response: { success: boolean; error?: string }) => {
          if (response && response.success) {
            loadSnapshots()
          } else {
            console.error('Delete older failed:', response ? response.error : 'No response')
          }
        }
      )
    }
  }

  return (
    <div>
      <div className="header">
        <h3>Tabs Snapshot</h3>
        <button onClick={handleSaveSnapshot}>Capture Now</button>
      </div>
      
      <div className="settings-section">
        <div className="interval-input">
          <label>Auto-snapshot every:</label>
          <input
            type="number"
            min="1"
            max="60"
            value={interval}
            onChange={(e) => handleIntervalChange(e.target.value)}
          />
          <span>minutes</span>
        </div>
        <div className="time-span">{timeSpan}</div>
        {errorMessage && (
          <div className="error-message show">{errorMessage}</div>
        )}
      </div>
      
      <div className="snapshots-list">
        {snapshots.length === 0 ? (
          <div className="empty-state">No snapshots yet</div>
        ) : (
          snapshots.map((snapshot) => (
            <SnapshotItem
              key={snapshot.id}
              snapshot={snapshot}
              isExpanded={expandedSnapshots.has(snapshot.id)}
              onToggle={() => toggleSnapshot(snapshot.id)}
              onDeleteSnapshot={handleDeleteSnapshot}
              onDeleteOlderSnapshots={handleDeleteOlderSnapshots}
              onRestoreSnapshot={handleRestoreSnapshot}
              onTabClick={handleTabClick}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App