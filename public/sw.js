self.addEventListener('notificationclick', event => {
  const {notification} = event;
  const {action} = event;
  if (action === 'cancel') {
      notification.close();
  } else {
      clients.openWindow('https://kcfeedpaperless.web.app/');
      notification.close();
  }
});

self.addEventListener('push', event => {
  const {data} = event;
  const options = {
    body: '전자결재',
    icon: '/favicon-96x96.png',
    actions: [
      {action: 'confirm', title: '확인'},
      {action: 'cancel', title: '취소'}
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.text(), options)
  );
});


addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});
