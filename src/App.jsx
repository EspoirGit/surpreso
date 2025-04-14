import { useState, useEffect, useRef } from 'react'
import './styles/App.css'

function App() {
  const [activeCard, setActiveCard] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const audioRef = useRef(null)

  const cards = [
    {
      id: 1,
      title: "Le silence avant…",
      content: "Il y a des choses qu'on ne remarque pas tout de suite.\n Comme une brise douce.\n Ou un battement d'ailes.",
      type: "text"
    },
    {
      id: 2,
      title: "Premier frisson",
      content: "Quelque chose dans l'air…\nUne impression que le jour ne sera pas tout à fait comme les autres.",
      type: "text"
    },
    {
      id: 3,
      title: "Des fragments de lumière",
      content: "Tu avances dans ce monde comme une note douce dans une grande symphonie.\nDiscrète, mais inoubliable.",
      type: "text",
      image: "/maxe 1.jpg"
    },
    {
      id: 4,
      title: "Ce que les autres ne voient pas toujours",
      content: "Il y a des forces tranquilles.\nDes beautés silencieuses.\nEt tu en fais partie.",
      type: "text"
    },
    {
      id: 5,
      title: "Ce qui fait la différence",
      content: "Ce n'est pas le bruit.\nCe n'est pas la vitesse.\nC'est la façon d'être.\nLa manière de rester soi.",
      type: "text",
      image: "/maxe 2.jpg"
    },
    {
      id: 6,
      title: "Les détails qui comptent",
      content: "Un regard, une parole, un geste.\nCe sont ces choses-là que tu maîtrises sans le savoir.",
      type: "text"
    },
    {
      id: 7,
      title: "L'élégance d'être soi",
      content: "Dans un monde où tout le monde crie pour exister…\nTu existes en murmurant.\nEt c'est puissant.",
      type: "text"
    },
    {
      id: 8,
      title: "Un fil invisible",
      content: "Quelque chose relie toutes ces pensées.\nQuelque chose… ou quelqu'un ?",
      type: "text"
    },
    {
      id: 9,
      title: "L'évidence commence à apparaître",
      content: "Il ne s'agissait pas de n'importe qui.\nCe message est en train de se dessiner… pour toi.",
      type: "text"
    },
    {
      id: 10,
      title: "Le moment arrive",
      content: "Tu pensais peut-être que ce n'était qu'un simple poème.\nMais non.\nC'est une attention.\nUne intention.",
      type: "text"
    },
    {
      id: 11,
      title: "La révélation",
      content: "Ce que tu viens de lire… c'était une façon de te dire quelque chose.\nQuelque chose d'important.",
      type: "text"
    },
    {
      id: 12,
      title: "Le cadeau",
      content: "Joyeux anniversaire, Maximine.\nTu es une lumière douce dans un monde pressé.\n\n\"Être moderne, ce n'est pas suivre le temps.\nC'est avoir le courage d'être pleinement soi.\"",
      type: "link",
      action: "Maxe.mp3"
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const cardHeight = 400 // hauteur approximative d'une carte
      
      // Si on est proche du bas de la page, activer la dernière carte
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        setActiveCard(cards.length - 1)
      } else {
        const newActiveCard = Math.floor(scrollPosition / cardHeight)
        if (newActiveCard !== activeCard && newActiveCard >= 0 && newActiveCard < cards.length) {
          setActiveCard(newActiveCard)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeCard, cards.length])

  const handleLastCardClick = async () => {
    if (cards[activeCard].type === 'link') {
      try {
        setShowPopup(true)
        if (audioRef.current) {
          audioRef.current.src = '/Maxe.mp3'
          audioRef.current.load()
          console.log('Audio chargé, tentative de lecture...')
        }
      } catch (error) {
        console.error('Erreur générale:', error)
        setIsPlaying(false)
      }
    }
  }

  const handleClosePopup = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    } catch (error) {
      console.error('Erreur lors de la fermeture:', error)
    }
    setIsPlaying(false)
    setShowPopup(false)
  }

  // Ajout d'un style pour assurer que le conteneur a une hauteur suffisante
  const containerStyle = {
    minHeight: `${(cards.length * 400) + 200}px` // hauteur minimale plus marge pour la dernière carte
  }

  return (
    <div className="app-container" style={containerStyle}>
      {[...Array(20)].map((_, i) => (
        <div key={i} className="star" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }}></div>
      ))}
      
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>
      <div className="floating-bubble"></div>

      {showPopup && (
        <div className="audio-popup" onClick={(e) => {
          if (e.target.className === 'audio-popup') {
            handleClosePopup()
          }
        }}>
          <div className="popup-content">
            <h3>🎵 Un message pour toi...</h3>
            <audio 
              ref={audioRef}
              src="/Maxe.mp3"
              controls
              preload="auto"
              onLoadedData={() => {
                console.log('Audio chargé avec succès')
                audioRef.current.play().catch(e => console.error('Erreur de lecture:', e))
              }}
              onError={(e) => {
                console.error('Erreur de chargement audio:', e)
                setIsPlaying(false)
              }}
              onPlay={() => {
                console.log('Lecture démarrée')
                setIsPlaying(true)
              }}
              onPause={() => {
                console.log('Lecture en pause')
                setIsPlaying(false)
              }}
              onEnded={() => {
                console.log('Lecture terminée')
                setIsPlaying(false)
                setShowPopup(false)
              }}
              style={{ width: '100%', marginTop: '20px' }}
            />
            <button className="close-popup" onClick={handleClosePopup}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${index === activeCard ? 'active' : ''}`}
          >
            <div className={`instagram-card ${card.image ? 'has-image' : ''}`}>
              <div className="card-header">
                <div className="profile-info">
                  <div className="profile-picture"></div>
                  <div className="username">@maxe</div>
                </div>
                <div className="post-time">Maintenant</div>
              </div>
              
              {card.image && (
                <div className="image-container">
                  <img src={card.image} alt="Maximine" className="card-image" />
                </div>
              )}

              <div className="card-body">
                <h2>{card.title}</h2>
                <p className="message">{card.content}</p>
                {card.type === 'link' && (
                  <button 
                    className="surprise-button" 
                    onClick={handleLastCardClick}
                    disabled={isPlaying}
                  >
                    Découvrir la surprise
                  </button>
                )}
              </div>

              <div className="likes-count">
                {Math.floor(Math.random() * 50) + 100} likes
              </div>

              <div className="comments-section">
                <button className="view-comments">
                  Voir les commentaires...
                </button>
              </div>

              <div className="card-actions">
                <button className="action-button heart">❤️</button>
                <button className="action-button comment">💭</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
