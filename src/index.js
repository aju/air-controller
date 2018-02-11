const miio = require('miio');

const devices = [
  {name: 'sypialnia', ip: '192.168.0.20'}
  //{name: 'salon', ip: '192.168.0.18'}
];

return getMaxFavoriteLevel() {

}

return getMinFavoriteLevel() {
  
}

function getUpdatedFavoriteLevel(currentFavoriteLevel, currentPmLevel) {
  if (currentPmLevel > 15 && currentFavoriteLevel < 16) {
    return currentFavoriteLevel + 1;
  } else if (currentPmLevel <= 15 && currentFavoriteLevel > 2) {
    return currentFavoriteLevel - 1;
  } else {
    return currentFavoriteLevel;
  }
}

async function checkDevice(currentDevice) {
  try {
    const device = await miio.device({address: currentDevice.ip});
    const pmLevel = await device.pm2_5();
    const favoriteLevel = await device.favoriteLevel();
    const newFavoriteLevel = getUpdatedFavoriteLevel(favoriteLevel, pmLevel);

    console.log(currentDevice.name, pmLevel, favoriteLevel, newFavoriteLevel);

    if (favoriteLevel !== newFavoriteLevel) {
      await device.favoriteLevel(newFavoriteLevel);
      return device.setMode('favorite');
    }

  } catch (e) {
    console.error(e);
  }
}

async function checkDevices() {
  try {
    await Promise.all(devices.map(device => checkDevice(device)));
  } catch (e) {
    console.error(e);
  }
}

async function setupDevices() {
  try {
    await Promise.all(devices.map(device => setupDevice(device)));
  } catch (e) {
    console.error(e);
  }
}

async function setupDevice(currentDevice) {
  try {
    const device = await miio.device({address: currentDevice.ip});

    await device.buzzer(false);
    await device.led(false);
  } catch (e) {
    console.error(e);
  }
}

setupDevices();
checkDevices();
setInterval(() => {
  checkDevices();
}, 30000);

