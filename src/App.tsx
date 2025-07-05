import React, { useState, useEffect, useRef } from 'react'

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
      const newSet = new Set(prev)
      if (newSet.has(snapshotId)) {
        newSet.delete(snapshotId)
      } else {
        newSet.add(snapshotId)
      }
      return newSet
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
          snapshots.map((snapshot) => {
            const date = new Date(snapshot.timestamp)
            const timeStr = date.toLocaleString()
            const dayStr = date.toLocaleDateString('en-US', { weekday: 'long' })
            const isExpanded = expandedSnapshots.has(snapshot.id)
            
            return (
              <div key={snapshot.id} className="snapshot-item">
                <div 
                  className="snapshot-header"
                  onClick={() => toggleSnapshot(snapshot.id)}
                >
                  <div className="snapshot-time">{timeStr} ({dayStr})</div>
                  <div className="snapshot-count">{snapshot.tabs.length} tabs</div>
                </div>
                
                {isExpanded && (
                  <div className="snapshot-tabs expanded">
                    <div className="delete-options">
                      <button 
                        className="delete delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSnapshot(snapshot.id)
                        }}
                      >
                        Delete
                      </button>
                      <button 
                        className="delete delete-older-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteOlderSnapshots(snapshot.id)
                        }}
                      >
                        Delete Older
                      </button>
                    </div>
                    
                    <div className="restore-options">
                      <button 
                        className="secondary restore-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestoreSnapshot(snapshot.id, false)
                        }}
                      >
                        Open All
                      </button>
                      <button 
                        className="secondary restore-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestoreSnapshot(snapshot.id, true)
                        }}
                      >
                        Replace Current
                      </button>
                    </div>
                    
                    {snapshot.tabs.map((tab, index) => (
                      <div 
                        key={index}
                        className="tab-item"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTabClick(tab.url)
                        }}
                      >
                        <div className="tab-title">{tab.title}</div>
                        <div className="tab-url">{tab.url}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default App