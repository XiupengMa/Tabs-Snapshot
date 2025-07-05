import React, { useState } from 'react'

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

interface SnapshotItemProps {
  snapshot: Snapshot
  isExpanded: boolean
  onToggle: () => void
  onDeleteSnapshot: (id: string) => void
  onDeleteOlderSnapshots: (id: string) => void
  onRestoreSnapshot: (id: string, closeExisting: boolean) => void
  onTabClick: (url: string) => void
}

const SnapshotItem: React.FC<SnapshotItemProps> = ({
  snapshot,
  isExpanded,
  onToggle,
  onDeleteSnapshot,
  onDeleteOlderSnapshots,
  onRestoreSnapshot,
  onTabClick
}) => {
  const date = new Date(snapshot.timestamp)
  const timeStr = date.toLocaleString()
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="snapshot-item" data-snapshot-id={snapshot.id}>
      <div 
        className={`snapshot-header ${isExpanded ? 'sticky' : ''}`}
        onClick={(e) => {
          // Only toggle if not clicking on buttons
          const target = e.target as HTMLElement
          if (target.closest('button')) {
            return
          }
          onToggle()
        }}
      >
        <div className="snapshot-info">
          <div className="snapshot-time">{timeStr} ({dayStr})</div>
          <div className="snapshot-count">{snapshot.tabs.length} tabs</div>
        </div>
        
        {isExpanded && (
          <div className="snapshot-controls">
            <div className="delete-options">
              <button 
                className="delete delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSnapshot(snapshot.id)
                }}
              >
                Delete
              </button>
              <button 
                className="delete delete-older-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteOlderSnapshots(snapshot.id)
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
                  onRestoreSnapshot(snapshot.id, false)
                }}
              >
                Open All
              </button>
              <button 
                className="secondary restore-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRestoreSnapshot(snapshot.id, true)
                }}
              >
                Replace Current
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="snapshot-tabs expanded">
          {snapshot.tabs.map((tab, index) => (
            <div 
              key={index}
              className="tab-item"
              onClick={(e) => {
                e.stopPropagation()
                onTabClick(tab.url)
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
}

export default SnapshotItem