<template>
    
    <fieldset class="stage" >
      <legend>dot-elastic</legend>
      <div class="dot-elastic"></div>
    </fieldset>
 
    <fieldset class="stage">
      <legend>dot-pulse</legend>
      <div class="dot-pulse"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-flashing</legend>
      <div class="dot-flashing"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-collision</legend>
      <div class="dot-collision"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-carousel</legend>
      <div class="dot-carousel"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-typing</legend>
      <div class="dot-typing"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-floating</legend>
      <div class="dot-floating"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-spin</legend>
      <div class="dot-spin"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-falling</legend>
      <div class="dot-falling"></div>
    </fieldset>
 
 
    <fieldset class="stage">
      <legend>dot-stretching</legend>
      <div class="dot-stretching"></div>
    </fieldset>
</template>

<style>
.stage {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  overflow: hidden;
}
.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
    10014px 0 0 0 #9880ff;
  animation: dotPulse 1.5s infinite linear;
}


.dot-elastic {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  animation: dotElastic 1s infinite linear;
}
.dot-elastic::before {
  left: -15px;
  animation: dotElasticBefore 1s infinite linear;
}
.dot-elastic::after {
  left: 15px;
  animation: dotElasticAfter 1s infinite linear;
}
.dot-elastic::before,
.dot-elastic::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}
.dot-flashing::before {
  left: -15px;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 15px;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}
.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}


.dot-collision {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-collision::before {
  left: -10px;
  animation: dotCollisionBefore 2s infinite ease-in;
}
.dot-collision::after {
  left: 10px;
  animation: dotCollisionAfter 2s infinite ease-in;
  animation-delay: 1s;
}
.dot-collision::before,
.dot-collision::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}


.dot-carousel {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
    10014px 0 0 0 #9880ff;
  animation: dotCarousel 1.5s infinite linear;
}


.dot-typing {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
    10014px 0 0 0 #9880ff;
  animation: dotTyping 1.5s infinite linear;
}


.dot-floating {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  animation: dotFloating 3s infinite cubic-bezier(0.15, 0.6, 0.9, 0.1);
}
.dot-floating::before {
  left: -12px;
  animation: dotFloatingBefore 3s infinite ease-in-out;
}
.dot-floating::after {
  left: -24px;
  animation: dotFloatingAfter 3s infinite cubic-bezier(0.4, 0, 1, 1);
}
.dot-floating::before,
.dot-floating::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}


.dot-spin {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: transparent;
  color: transparent;
  box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
    18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0),
    0 18px 0 0 rgba(152, 128, 255, 0),
    -12.72984px 12.72984px 0 0 rgba(152, 128, 255, 0),
    -18px 0 0 0 rgba(152, 128, 255, 0),
    -12.72984px -12.72984px 0 0 rgba(152, 128, 255, 0);
  animation: dotSpin 1.5s infinite linear;
}


.dot-falling {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9999px 0 0 0 #9880ff;
  animation: dotFalling 1s infinite linear;
  animation-delay: 0.1s;
}


.dot-falling::before,
.dot-falling::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-falling::before {
  animation: dotFallingBefore 1s infinite linear;
  animation-delay: 0s;
}
.dot-falling::after {
  animation: dotFallingAfter 1s infinite linear;
  animation-delay: 0.2s;
}


.dot-stretching {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  animation: dotStretching 2s infinite ease-in;
  transform: scale(1.25, 1.25);
}


.dot-stretching::before,
.dot-stretching::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-stretching::before {
  animation: dotStretchingBefore 2s infinite ease-in;
}
.dot-stretching::after {
  animation: dotStretchingAfter 2s infinite ease-in;
}


@keyframes dotStretchingBefore {
  0% {
    transform: translate(0) scale(0.7, 0.7);
  }


  50%,
  60% {
    transform: translate(-20px) scale(1, 1);
  }
  100% {
    transform: translate(0) scale(0.7, 0.7);
  }
}


@keyframes dotStretchingAfter {
  0% {
    transform: translate(0) scale(0.7, 0.7);
  }
  50%,
  60% {
    transform: translate(20px) scale(1, 1);
  }
  100% {
    transform: translate(0) scale(0.7, 0.7);
  }
}
@keyframes dotStretching {
  0% {
    transform: scale(1.25, 1.25);
  }
  50%,
  60% {
    transform: scale(0.8, 0.8);
  }
  100% {
    transform: scale(1.25, 1.25);
  }
}


@keyframes dotFallingAfter {
  0% {
    box-shadow: 10014px -15px 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 10014px 0 0 0 #9880ff;
  }
  100% {
    box-shadow: 10014px 15px 0 0 rgba(152, 128, 255, 0);
  }
}
@keyframes dotFallingBefore {
  0% {
    box-shadow: 9984px -15px 0 0 rgba(152, 128, 255, 0);
  }


  25%,
  50%,
  75% {
    box-shadow: 9984px 0 0 0 #9880ff;
  }
  100% {
    box-shadow: 9984px 15px 0 0 rgba(152, 128, 255, 0);
  }
}
@keyframes dotFalling {
  0% {
    box-shadow: 9999px -15px 0 0 rgba(152, 128, 255, 0);
  }
  25%,
  50%,
  75% {
    box-shadow: 9999px 0 0 0 #9880ff;
  }


  100% {
    box-shadow: 9999px 15px 0 0 rgba(152, 128, 255, 0);
  }
}


@keyframes dotSpin {
  0%,
  100% {
    box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
      18px 0 0 0 #9880ff,
      12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      0 18px 0 -5px rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      -18px 0 0 -5px rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
  }
  12.5% {
    box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
      12.72984px -12.72984px 0 0 #9880ff, 18px 0 0 0 #9880ff,
      12.72984px 12.72984px 0 0 #9880ff,
      0 18px 0 -5px rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      -18px 0 0 -5px rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
  }
  25% {
    box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
      12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
      18px 0 0 0 #9880ff, 12.72984px 12.72984px 0 0 #9880ff,
      0 18px 0 0 #9880ff,
      -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      -18px 0 0 -5px rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
  }
  37.5% {
    box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
      12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
      18px 0 0 -5px rgba(152, 128, 255, 0),
      12.72984px 12.72984px 0 0 #9880ff, 0 18px 0 0 #9880ff,
      -12.72984px 12.72984px 0 0 #9880ff,
      -18px 0 0 -5px rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
  }
  50% {
    box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
      12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
      18px 0 0 -5px rgba(152, 128, 255, 0),
      12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      0 18px 0 0 #9880ff, -12.72984px 12.72984px 0 0 #9880ff,
      -18px 0 0 0 #9880ff,
      -12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0);
  }
  62.5% {
    box-shadow: 0 -18px 0 -5px rgba(152, 128, 255, 0),
      12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
      18px 0 0 -5px rgba(152, 128, 255, 0),
      12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      0 18px 0 -5px rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 0 #9880ff, -18px 0 0 0 #9880ff,
      -12.72984px -12.72984px 0 0 #9880ff;
  }
  75% {
    box-shadow: 0 -18px 0 0 #9880ff,
      12.72984px -12.72984px 0 -5px rgba(152, 128, 255, 0),
      18px 0 0 -5px rgba(152, 128, 255, 0),
      12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      0 18px 0 -5px rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      -18px 0 0 0 #9880ff, -12.72984px -12.72984px 0 0 #9880ff;
  }
  87.5% {
    box-shadow: 0 -18px 0 0 #9880ff, 12.72984px -12.72984px 0 0 #9880ff,
      18px 0 0 -5px rgba(152, 128, 255, 0),
      12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      0 18px 0 -5px rgba(152, 128, 255, 0),
      -12.72984px 12.72984px 0 -5px rgba(152, 128, 255, 0),
      -18px 0 0 -5px rgba(152, 128, 255, 0),
      -12.72984px -12.72984px 0 0 #9880ff;
  }
}
@keyframes dotFloating {
  0% {
    left: calc(-50% - 5px);
  }
  75% {
    left: calc(50% + 105px);
  }
  100% {
    left: calc(50% + 105px);
  }
}
@keyframes dotFloatingBefore {
  0% {
    left: -50px;
  }
  50% {
    left: -12px;
  }
  75% {
    left: -50px;
  }
  100% {
    left: -50px;
  }
}
@keyframes dotFloatingAfter {
  0% {
    left: -100px;
  }
  50% {
    left: -24px;
  }
  75% {
    left: -100px;
  }
  100% {
    left: -100px;
  }
}


@keyframes dotTyping {
  0% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
  16.667% {
    box-shadow: 9984px -10px 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
  33.333% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
  50% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px -10px 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
  66.667% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
  83.333% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px -10px 0 0 #9880ff;
  }
  100% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 0 #9880ff;
  }
}


@keyframes dotCarousel {
  0% {
    box-shadow: 9984px 0 0 -1px #9880ff, 9999px 0 0 1px #9880ff,
      10014px 0 0 -1px #9880ff;
  }


  50% {
    box-shadow: 10014px 0 0 -1px #9880ff, 9984px 0 0 -1px #9880ff,
      9999px 0 0 1px #9880ff;
  }
  100% {
    box-shadow: 9999px 0 0 1px #9880ff, 10014px 0 0 -1px #9880ff,
      9984px 0 0 -1px #9880ff;
  }
}
@keyframes dotPulse {
  0% {
    box-shadow: 9984px 0 0 -5px #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 2px #9880ff;
  }


  25% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 2px #9880ff,
      10014px 0 0 0 #9880ff;
  }
  50% {
    box-shadow: 9984px 0 0 2px #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 -5px #9880ff;
  }
  75% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 -5px #9880ff,
      10014px 0 0 0 #9880ff;
  }
  100% {
    box-shadow: 9984px 0 0 -5px #9880ff, 9999px 0 0 0 #9880ff,
      10014px 0 0 2px #9880ff;
  }
}
@keyframes dotElasticAfter {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes dotElasticBefore {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes dotElastic {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes dotFlashing {
  0% {
    background-color: #9880ff;
  }
  100% {
    background-color: #ebe6ff;
  }
}


@keyframes dotCollisionAfter {
  0%,
  50%,
  75%,
  100% {
    transform: translateX(0);
  }


  25% {
    transform: translateX(15px);
  }
}


@keyframes dotCollisionBefore {
  0%,
  50%,
  75%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-15px);
  }
}
</style>
