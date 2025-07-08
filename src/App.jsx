import Header from './components/Header';
import InputQuery from './components/InputQuery';
import Body from './components/Body';

function App() {
  return (
    <div className="h-screen flex flex-col bg-[#121212]">
      {/* Fixed Header */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto bg-[#212121] scrollbar-custom">
        <Body />
      </div>

      {/* Fixed Input */}
      <div className="shrink-0 bg-[#212121]">
        <InputQuery />
      </div>
    </div>
  );
}

export default App;
