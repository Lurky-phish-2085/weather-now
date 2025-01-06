import { useEffect } from "react";
import { BiWorld } from "react-icons/bi";
import { BsFillGeoAltFill } from "react-icons/bs";
import { RiGitRepositoryFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";

type AboutDialogProps = {
  open: boolean;
  onClose: () => void;
};

function AboutModal({ open, onClose }: AboutDialogProps) {
  const toggleDialog = () => {
    ui("#about-dialog");
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    toggleDialog();
  }, [open]);

  const handleClick = () => {
    onClose();
    toggleDialog();
  };

  return (
    <>
      <div className="dialog-code">
        <div className="overlay"></div>
        <dialog id="about-dialog" className="modal">
          <h5>About</h5>
          <div className="padding">
            <img
              className="circle large"
              src="https://static-00.iconduck.com/assets.00/white-sun-with-small-cloud-emoji-2048x2048-df62n3eb.png"
              alt=""
            />
            <h5>Weather Now</h5>
            <div className="bottom-padding">Check the weather right now!</div>
            <div className="bottom-padding">
              <RiGitRepositoryFill style={{ width: 32, height: 32 }} />
              <span>&nbsp;</span>
              <a
                className="link"
                href="https://github.com/Lurky-phish-2085/weather-now"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code
              </a>
            </div>
            <div className="large-text">
              <strong>External APIs used:</strong>
            </div>
            <div className="top-padding">
              <div className="grid small-space">
                <div className="s12">
                  <TiWeatherPartlySunny style={{ width: 32, height: 32 }} />
                  <span>&nbsp;</span>
                  <a
                    className="link"
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open-Meteo
                  </a>
                </div>
                <div className="s12">
                  <BsFillGeoAltFill style={{ width: 32, height: 32 }} />
                  <span>&nbsp;</span>
                  <a
                    className="link"
                    href="https://nominatim.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nominatim
                  </a>
                </div>
                <div className="s12">
                  <BiWorld style={{ width: 32, height: 32 }} />
                  <span>&nbsp;</span>
                  <a
                    className="link"
                    href="https://country.is/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Country
                  </a>
                </div>
              </div>
            </div>
          </div>
          <nav className="right-align no-space">
            <button onClick={handleClick} className="transparent link">
              Confirm
            </button>
          </nav>
        </dialog>
      </div>
    </>
  );
}

export default AboutModal;
