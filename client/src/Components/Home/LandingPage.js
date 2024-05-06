import React from 'react'
import './LandingPage.scss'
import Lottie from 'react-lottie';
import animationData from './Lottie/security-research.json';

const LandingPage = () => {
  return (
    <div className='container'>
        <div className='container__text'>
            <div className='header'>
            Sentinals of Your Confidentiality: Protecting Your Important Documents
            </div>
            <div className='summary'>
            Take control of the privacy of your precious documents by using InfoSentinel, ensuring that only those you've granted access can use them.
            </div>
        </div>
        <div className='container__anim'>
            {/* <script src='./security-research.json'></script> */}
            {/* <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

            <lottie-player src="https://lottie.host/6f4ee854-3625-4849-8985-e423a0752949/hZWZsrb0zk.json" background="transparent" speed="1" style={{width: '300px', height: '300px'}} direction="1" mode="normal" loop controls autoplay>
            </lottie-player> */}
            <Lottie 
                options={{loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice"
                    }
                  }}
                height={400}
                width={450}
            />
        </div>
    </div>
  )
}

export default LandingPage
