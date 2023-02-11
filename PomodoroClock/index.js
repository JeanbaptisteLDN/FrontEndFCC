function App() {

    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setbreakAudio] = React.useState(new Audio('./breakAudio.mp3'));

    const playBreakAudio = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();

    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime((prev) => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakAudio();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        }
                        else if (prev <= 0 && !onBreakVariable) {
                            playBreakAudio();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }


                        return prev - 1;
                    });
                    nextDate += second;
                }

            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        }
        if (timerOn) {
            clearInterval(localStorage.getItem('interval-id'));
        }
        setTimerOn(!timerOn);
    };

    const resetTime = () => {
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
    };

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return ((minutes < 10 ? "0" + minutes : minutes)
            + ":"
            + (seconds < 10 ? "0" + seconds : seconds));
    };

    const changeTime = (amount, type) => {
        if (type == 'break') {
            if (breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime(prev => prev + amount)
        }
        else {
            if (sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime(prev => prev + amount)
            if (!timerOn) {
                setDisplayTime(sessionTime + amount);
            }
        }
    }

    return (
        <div className="center-align">
            <h1>Pomodoro Clock</h1>
            <div className="dual-container">
                <div id="break-label">
                    <LengthBreak title={"break length"}
                        changeTime={changeTime}
                        type={"break"}
                        time={breakTime}
                        formatTime={formatTime} /></div>
                <div id="session-label">
                    <LengthSession title={"session length"}
                        changeTime={changeTime}
                        type={"session"}
                        time={sessionTime}
                        formatTime={formatTime} /></div>
            </div>
            <h3>{onBreak ? "Break" : "Session"}</h3>
            <h1>{formatTime(displayTime)}</h1>
            <button className="btn-large deep-purple lighten-2" onClick={controlTime}>
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ) : (<i className="material-icons">play_circle_filled</i>)}
            </button>
            <button className="btn-large deep-purple lighten-2" onClick={resetTime}>
                <i className="material-icons">autorenew</i>
            </button>
        </div>);
}

function LengthBreak({ title, changeTime, type, time, formatTime }) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button id="break-decrement" className="btn-small deep-purple lighten-2" onClick={() => changeTime(-60, type)}>
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id="break-length">{formatTime(time)}</h3>
                <button id="break-increment" className="btn-small deep-purple lighten-2" onClick={() => changeTime(+60, type)}>
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}
function LengthSession({ title, changeTime, type, time, formatTime }) {
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button id="session-decrement" className="btn-small deep-purple lighten-2" onClick={() => changeTime(-60, type)}>
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id="session-length">{formatTime(time)}</h3>
                <button id="session-increment" className="btn-small deep-purple lighten-2" onClick={() => changeTime(+60, type)}>
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));