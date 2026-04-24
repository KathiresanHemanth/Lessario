"use client";

import { useEffect, useRef, useState, useCallback } from "react";
// @ts-ignore
import WebGPU from "three/addons/capabilities/WebGPU.js";

import { GameSetup } from "@/game/GameSetup";
import { PlayerController } from "@/game/PlayerController";
import { CameraController } from "@/game/CameraController";
import { Environment } from "@/game/Environment";
import { StorySystem, StoryState, StoryCallbacks } from "@/game/StorySystem";

interface DialogueState {
  visible: boolean;
  speaker: string;
  text: string;
}

export default function WebGPUGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [webGPUError, setWebGPUError] = useState(false);

  // UI State
  const [prompt, setPrompt] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState<DialogueState>({
    visible: false,
    speaker: "",
    text: "",
  });
  const [questState, setQuestState] = useState<StoryState>("quest_available");
  const [showRelicCollected, setShowRelicCollected] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Refs that persist across renders for the game loop
  const gameRef = useRef<{
    setup: GameSetup;
    player: PlayerController;
    camera: CameraController;
    environment: Environment;
    story: StorySystem;
    animFrameId: number;
  } | null>(null);

  // Story callbacks wired to React state
  const storyCallbacks = useRef<StoryCallbacks>({
    onShowPrompt: (text: string) => setPrompt(text),
    onHidePrompt: () => setPrompt(null),
    onShowDialogue: (speaker: string, text: string) =>
      setDialogue({ visible: true, speaker, text }),
    onHideDialogue: () =>
      setDialogue({ visible: false, speaker: "", text: "" }),
    onQuestUpdate: (state: StoryState) => setQuestState(state),
    onRelicCollected: () => {
      setShowRelicCollected(true);
      setTimeout(() => setShowRelicCollected(false), 3000);
    },
  });

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // WebGPU check
    if (WebGPU.isAvailable() === false) {
      setWebGPUError(true);
      return;
    }

    let disposed = false;

    const initGame = async () => {
      const container = containerRef.current!;

      // 1. Game Setup (renderer, scene, lighting)
      const setup = new GameSetup();
      await setup.init(container);
      if (disposed) return;

      // 2. Player Controller
      const player = new PlayerController();
      setup.scene.add(player.group);
      player.bindInput();

      // 3. Camera Controller
      const camera = new CameraController(setup.camera);
      camera.bindInput(setup.renderer.domElement);

      // 4. Environment
      const environment = new Environment(setup.scene);

      // 5. Story System
      const story = new StorySystem(setup.scene, storyCallbacks.current);
      story.bindInput();

      setIsReady(true);

      // Hide controls hint after 8 seconds
      setTimeout(() => setShowControls(false), 8000);

      // Store refs
      gameRef.current = {
        setup,
        player,
        camera,
        environment,
        story,
        animFrameId: 0,
      };

      // === GAME LOOP ===
      const animate = () => {
        if (disposed) return;
        gameRef.current!.animFrameId = requestAnimationFrame(animate);

        const dt = Math.min(setup.clock.getDelta(), 0.05); // Cap delta to prevent physics explosions

        // Update systems
        player.update(dt, camera.yaw, environment.collidables);
        camera.update(dt, player.group.position);
        environment.update(dt);
        story.update(dt, player.group.position);

        // Render
        setup.render();
      };

      animate();
    };

    initGame();

    // Resize handler
    const onResize = () => {
      if (gameRef.current) {
        gameRef.current.setup.onResize();
      }
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);

      if (gameRef.current) {
        const { setup, player, camera, story, animFrameId } = gameRef.current;
        cancelAnimationFrame(animFrameId);
        player.unbindInput();
        camera.unbindInput();
        story.unbindInput();
        if (containerRef.current) {
          setup.dispose(containerRef.current);
        }
      }
    };
  }, []);

  return (
    <div
      className="game-root"
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#050510",
      }}
    >
      {/* Loading Screen */}
      {!isReady && !webGPUError && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.loadingSpinner} />
            <h2 style={styles.loadingTitle}>Shores of Thiruchendur</h2>
            <p style={styles.loadingSubtitle}>Initializing WebGPU Engine...</p>
          </div>
        </div>
      )}

      {/* WebGPU Error */}
      {webGPUError && (
        <div style={styles.loadingOverlay}>
          <div style={styles.errorBox}>
            <h2 style={{ color: "#ff4444", marginBottom: 12, fontSize: 24 }}>
              ⚠️ WebGPU Not Supported
            </h2>
            <p style={{ color: "#ccc", lineHeight: 1.6 }}>
              Your browser does not support WebGPU. Please use Chrome 113+ or
              Edge 113+ with WebGPU enabled.
            </p>
          </div>
        </div>
      )}

      {/* === HUD OVERLAY === */}
      {isReady && (
        <>
          {/* Game Title & Controls */}
          <div style={styles.hudTopLeft}>
            <h1 style={styles.gameTitle}>
              Shores of Thiruchendur
            </h1>
            {showControls && (
              <div style={styles.controlsBox}>
                <p style={styles.controlLine}>
                  <span style={styles.keyBadge}>WASD</span> Move
                </p>
                <p style={styles.controlLine}>
                  <span style={styles.keyBadge}>SPACE</span> Jump
                </p>
                <p style={styles.controlLine}>
                  <span style={styles.keyBadge}>MOUSE</span> Look (click to lock)
                </p>
                <p style={styles.controlLine}>
                  <span style={styles.keyBadge}>E</span> Interact
                </p>
              </div>
            )}
          </div>

          {/* Quest Tracker */}
          <div style={styles.questTracker}>
            <div style={styles.questHeader}>
              <span style={styles.questIcon}>📜</span>
              <span style={styles.questLabel}>Quest</span>
            </div>
            <p style={styles.questText}>
              {questState === "quest_available" && "Talk to the Temple Priest near the pillars"}
              {questState === "quest_active" && "Find the Sacred Relic near the water (southwest)"}
              {questState === "quest_complete" && "✅ Quest Complete! Return to the Priest"}
            </p>
          </div>

          {/* Interaction Prompt */}
          {prompt && (
            <div style={styles.promptContainer}>
              <div style={styles.promptBox}>
                <span style={styles.promptKey}>E</span>
                <span style={styles.promptText}>{prompt}</span>
              </div>
            </div>
          )}

          {/* Dialogue Overlay */}
          {dialogue.visible && (
            <div style={styles.dialogueOverlay}>
              <div style={styles.dialogueBox}>
                <div style={styles.dialogueSpeaker}>{dialogue.speaker}</div>
                <p style={styles.dialogueText}>{dialogue.text}</p>
                <div style={styles.dialogueContinue}>
                  Press <span style={styles.keyBadgeSmall}>E</span> or{" "}
                  <span style={styles.keyBadgeSmall}>ESC</span> to close
                </div>
              </div>
            </div>
          )}

          {/* Relic Collected Notification */}
          {showRelicCollected && (
            <div style={styles.notificationContainer}>
              <div style={styles.notificationBox}>
                <span style={{ fontSize: 28 }}>✨</span>
                <div>
                  <div style={styles.notificationTitle}>Sacred Relic Collected!</div>
                  <div style={styles.notificationSub}>Return to the Temple Priest</div>
                </div>
              </div>
            </div>
          )}

          {/* Crosshair */}
          <div style={styles.crosshair} />
        </>
      )}
    </div>
  );
}

// ==================== INLINE STYLES ====================
// Using inline styles to keep the game component self-contained
// and avoid Tailwind dependencies for the game HUD.

const styles: { [key: string]: React.CSSProperties } = {
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    background: "linear-gradient(135deg, #050510 0%, #0a1628 100%)",
  },
  loadingContent: {
    textAlign: "center",
    color: "#fff",
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTopColor: "#ffd700",
    borderRadius: "50%",
    margin: "0 auto 24px",
    animation: "spin 0.8s linear infinite",
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    marginBottom: 8,
    background: "linear-gradient(90deg, #ffd700, #ffaa00)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loadingSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "'Inter', monospace",
  },
  errorBox: {
    background: "rgba(255,0,0,0.1)",
    border: "1px solid rgba(255,60,60,0.3)",
    borderRadius: 12,
    padding: "32px 40px",
    maxWidth: 420,
    textAlign: "center" as const,
  },

  // HUD
  hudTopLeft: {
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 50,
    pointerEvents: "none",
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#fff",
    textShadow: "0 2px 12px rgba(0,0,0,0.7)",
    marginBottom: 12,
    letterSpacing: "0.5px",
  },
  controlsBox: {
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
    borderRadius: 10,
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  controlLine: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    margin: "4px 0",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  keyBadge: {
    display: "inline-block",
    background: "rgba(255,215,0,0.15)",
    color: "#ffd700",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "monospace",
    border: "1px solid rgba(255,215,0,0.3)",
    minWidth: 42,
    textAlign: "center" as const,
  },

  // Quest Tracker
  questTracker: {
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 50,
    pointerEvents: "none",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
    borderRadius: 12,
    padding: "14px 18px",
    border: "1px solid rgba(255,215,0,0.15)",
    maxWidth: 280,
  },
  questHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  questIcon: {
    fontSize: 18,
  },
  questLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ffd700",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    fontFamily: "'Inter', sans-serif",
  },
  questText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },

  // Interaction Prompt
  promptContainer: {
    position: "absolute",
    bottom: 180,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
    pointerEvents: "none",
  },
  promptBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    borderRadius: 8,
    padding: "10px 20px",
    border: "1px solid rgba(255,215,0,0.3)",
  },
  promptKey: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    background: "rgba(255,215,0,0.2)",
    color: "#ffd700",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 800,
    fontFamily: "monospace",
    border: "1px solid rgba(255,215,0,0.5)",
  },
  promptText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
  },

  // Dialogue
  dialogueOverlay: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 60,
    pointerEvents: "auto",
    width: "min(90vw, 640px)",
  },
  dialogueBox: {
    background: "linear-gradient(135deg, rgba(10,15,30,0.92) 0%, rgba(20,25,50,0.92) 100%)",
    backdropFilter: "blur(16px)",
    borderRadius: 16,
    padding: "24px 28px",
    border: "1px solid rgba(255,215,0,0.15)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  dialogueSpeaker: {
    fontSize: 14,
    fontWeight: 800,
    color: "#ffd700",
    textTransform: "uppercase" as const,
    letterSpacing: "1.5px",
    marginBottom: 8,
    fontFamily: "'Inter', sans-serif",
  },
  dialogueText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.7,
    margin: 0,
    marginBottom: 12,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  dialogueContinue: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textAlign: "right" as const,
    fontFamily: "'Inter', sans-serif",
  },
  keyBadgeSmall: {
    display: "inline-block",
    background: "rgba(255,255,255,0.1)",
    padding: "1px 6px",
    borderRadius: 3,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "monospace",
  },

  // Notification
  notificationContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 70,
    pointerEvents: "none",
  },
  notificationBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,170,0,0.1) 100%)",
    backdropFilter: "blur(12px)",
    borderRadius: 14,
    padding: "18px 28px",
    border: "1px solid rgba(255,215,0,0.4)",
    boxShadow: "0 4px 30px rgba(255,215,0,0.2)",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffd700",
    fontFamily: "'Inter', sans-serif",
  },
  notificationSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
    fontFamily: "'Inter', sans-serif",
  },

  // Crosshair
  crosshair: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 6,
    height: 6,
    marginTop: -3,
    marginLeft: -3,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    border: "1px solid rgba(255,255,255,0.5)",
    zIndex: 40,
    pointerEvents: "none",
  },
};
