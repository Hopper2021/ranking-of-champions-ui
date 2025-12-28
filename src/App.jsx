import { useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import './App.css';

const App = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  const [scanner, setScanner] = useState(null);

  const startScan = async () => {
    if (scanner) {
      scanner.stop();
      setScanner(null);
      return;
    }

    try {
      const newScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScannedData(result.data);
          console.log('QR Code detected:', result.data);
          // If it's a link, you can handle it here, e.g., window.open(result.data)
        },
        {
          onDecodeError: (err) => {
            console.error('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      await newScanner.start();
      setScanner(newScanner);
    } catch (error) {
      console.error('Error starting scanner:', error);
      alert('Camera access denied or not available.');
    }
  };

  const stopScan = () => {
    if (scanner) {
      scanner.stop();
      setScanner(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>QR Code Scanner</h1>
        <button onClick={startScan}>
          {scanner ? 'Stop Scanning' : 'Start Scanning'}
        </button>
        <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
        {scannedData && (
          <div>
            <p>Scanned Data: {scannedData}</p>
            {scannedData.startsWith('http') && (
              <a href={scannedData} target="_blank" rel="noopener noreferrer">
                Open Link
              </a>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
