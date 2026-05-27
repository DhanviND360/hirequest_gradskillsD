"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ArenaSession from "@/components/ArenaSession";
import { CANDIDATES, VideoTelemetryPanel } from "@/components/VideoTelemetryPanel";
import "../recruiter.css";

const INITIAL_BOARD = {
  applied: [
    { id: "c1", name: "Priya Patel", score: 96, class: "React Champion" },
    { id: "c4", name: "Divya Naidu", score: 85, class: "AI Alchemist" }
  ],
  screening: [
    { id: "c2", name: "Arjun Sharma", score: 92, class: "Novice Explorer" }
  ],
  arena: [
    { id: "c3", name: "Rahul Kumar", score: 88, class: "Quest Specialist" }
  ],
  hired: []
};

export default function PipelinePage() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [mounted, setMounted] = useState(false);
  const [arenaCandidate, setArenaCandidate] = useState(null);
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Dropped outside a column
    if (!destination) return;

    // Dropped in the same column at the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const fromCol = source.droppableId;
    const toCol = destination.droppableId;

    setBoard((prev) => {
      const sourceList = Array.from(prev[fromCol]);
      const destList = Array.from(prev[toCol]);
      const [movedCandidate] = sourceList.splice(source.index, 1);

      if (fromCol === toCol) {
        sourceList.splice(destination.index, 0, movedCandidate);
        return {
          ...prev,
          [fromCol]: sourceList
        };
      } else {
        destList.splice(destination.index, 0, movedCandidate);
        return {
          ...prev,
          [fromCol]: sourceList,
          [toCol]: destList
        };
      }
    });
  };

  // Real-time Pipeline Metrics calculations
  const allCandidates = [...board.applied, ...board.screening, ...board.arena, ...board.hired];
  const avgScore = allCandidates.length 
    ? Math.round(allCandidates.reduce((acc, c) => acc + c.score, 0) / allCandidates.length) 
    : 0;
  const activeArena = board.arena.length;
  const hiredCount = board.hired.length;
  const totalCount = allCandidates.length;
  const hiredSuccessRate = totalCount ? Math.round((hiredCount / totalCount) * 100) : 0;

  if (!mounted) {
    return (
      <div className="recruiter-page">
        <div className="page-header-rec">
          <h2 className="page-title-rec">⚔️ Interview Arena Pipeline (Kanban)</h2>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          Initializing Arena Coordinates...
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      <div className="page-header-rec" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
        <h2 className="page-title-rec">⚔️ Interview Arena Pipeline (Kanban)</h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Drag and drop candidate cards across columns to advance their recruitment quest line.
        </span>
      </div>

      {/* Real-time Arena Pipeline Summary */}
      <div className="pipeline-summary-card card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>
        <h3 className="panel-card-title" style={{ marginBottom: 'var(--space-md)', fontSize: '0.8rem', letterSpacing: '1px' }}>
          📊 Real-Time Arena metrics summary
        </h3>
        
        <div className="pipeline-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', textAlign: 'center' }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Talent Force</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>{totalCount}</div>
          </div>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Avg Fit Score</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--purple-400)', marginTop: '4px' }}>{avgScore}%</div>
          </div>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Active Raids</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-red)', marginTop: '4px' }}>{activeArena}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Guild Hires</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-green)', marginTop: '4px' }}>{hiredCount}</div>
          </div>
        </div>
        
        {/* Progress Bar Mapping Success Rate */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', fontWeight: '600' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Raid Completion Progress</span>
            <span style={{ color: 'var(--accent-green)' }}>{hiredSuccessRate}% Complete</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${hiredSuccessRate}%`, 
                background: 'linear-gradient(90deg, var(--purple-500), var(--accent-green))', 
                borderRadius: 'var(--radius-full)', 
                transition: 'width 0.4s ease-out' 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Kanban Drag and Drop Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          
          {/* Column 1: Applied */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span>📜 Quest Signs (Applied)</span>
              <span className="kanban-column-count">{board.applied.length}</span>
            </div>
            
            <Droppable droppableId="applied">
              {(provided, snapshot) => (
                <div
                  className={`kanban-column-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {board.applied.map((c, index) => (
                    <Draggable draggableId={c.id} index={index} key={c.id}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{c.score}%</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.class}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Column 2: Screening */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span>🛡️ AI Screening (Review)</span>
              <span className="kanban-column-count">{board.screening.length}</span>
            </div>
            
            <Droppable droppableId="screening">
              {(provided, snapshot) => (
                <div
                  className={`kanban-column-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {board.screening.map((c, index) => (
                    <Draggable draggableId={c.id} index={index} key={c.id}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{c.score}%</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.class}</span>
                          
                          <button 
                            className="btn btn-sm btn-primary"
                            style={{ 
                              width: '100%', 
                              marginTop: '6px', 
                              fontSize: '0.78rem', 
                              padding: '5px 10px', 
                              borderRadius: '6px',
                              boxShadow: 'none'
                            }}
                            onClick={() => {
                              const detailedCandidate = CANDIDATES.find(cand => cand.name === c.name);
                              if (detailedCandidate) {
                                setVideoModal(detailedCandidate);
                              } else {
                                alert(`Could not find detailed analysis for ${c.name}`);
                              }
                            }}
                          >
                            🎬 Review Video Cry
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Column 3: Arena */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span>⚔️ Boss Arena (Interview)</span>
              <span className="kanban-column-count">{board.arena.length}</span>
            </div>
            
            <Droppable droppableId="arena">
              {(provided, snapshot) => (
                <div
                  className={`kanban-column-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {board.arena.map((c, index) => (
                    <Draggable draggableId={c.id} index={index} key={c.id}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{c.score}%</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.class}</span>
                          
                          <button 
                            className="btn btn-sm btn-primary"
                            style={{ 
                              width: '100%', 
                              marginTop: '6px', 
                              fontSize: '0.78rem', 
                              padding: '5px 10px', 
                              borderRadius: '6px',
                              boxShadow: 'none'
                            }}
                            onClick={() => setArenaCandidate(c)}
                          >
                            🔴 Start Arena Session
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Column 4: Hired */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span>🏆 Hired Quest Complete</span>
              <span className="kanban-column-count">{board.hired.length}</span>
            </div>
            
            <Droppable droppableId="hired">
              {(provided, snapshot) => (
                <div
                  className={`kanban-column-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {board.hired.map((c, index) => (
                    <Draggable draggableId={c.id} index={index} key={c.id}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ 
                            ...provided.draggableProps.style,
                            borderColor: 'var(--accent-green)',
                            background: 'rgba(34, 197, 94, 0.05)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Hired!</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.class}</span>
                          <span style={{ fontSize: '1.2rem', marginTop: '4px', textAlign: 'center' }}>👑</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

        </div>
      </DragDropContext>

      {/* Live Arena Session Modal */}
      {arenaCandidate && (
        <ArenaSession
          candidate={arenaCandidate}
          onClose={() => setArenaCandidate(null)}
        />
      )}

      {/* Detailed Battle Cry Video Analysis Modal */}
      {videoModal && (
        <VideoTelemetryPanel
          candidate={videoModal}
          onClose={() => setVideoModal(null)}
        />
      )}
    </div>
  );
}
