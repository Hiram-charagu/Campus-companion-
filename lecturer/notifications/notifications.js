let notifications = window.CampusPortal.getNotifications();

function getUnreadCount() {
    return notifications.filter((notification) => notification.unread).length;
}

function updateUnreadLabel() {
    const count = getUnreadCount();
    const unreadLabel = document.getElementById("unread-label");
    const badge = document.getElementById("notif-count");

    unreadLabel.textContent = count ? `${count} unread notification${count === 1 ? "" : "s"}` : "You are all caught up";
    badge.textContent = count;
    badge.classList.toggle("is-hidden", count === 0);
    window.CampusPortal.syncNotificationBadges();
}

function renderNotifications() {
    const list = document.getElementById("notif-list");

    if (!notifications.length) {
        list.innerHTML = '<div class="empty-state"><div class="empty-icon">🔕</div><p>No notifications yet.</p></div>';
        return;
    }

    list.innerHTML = notifications.map((notification) => `
        <article class="notif-item ${notification.unread ? "unread" : ""}" data-id="${notification.id}">
            <div class="notif-icon ${notification.color}">${notification.icon}</div>
            <div class="notif-body">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notif-time">${notification.time}</span>
            </div>
            ${notification.unread ? '<div class="unread-dot" aria-label="Unread"></div>' : ""}
        </article>
    `).join("");

    document.querySelectorAll(".notif-item").forEach((item) => {
        item.addEventListener("click", () => markAsRead(Number(item.dataset.id)));
    });
}

function markAsRead(id) {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || !notification.unread) return;

    notification.unread = false;
    window.CampusPortal.saveNotifications(notifications);
    renderNotifications();
    updateUnreadLabel();
}

function markAllRead() {
    notifications = notifications.map((notification) => ({ ...notification, unread: false }));
    window.CampusPortal.saveNotifications(notifications);
    renderNotifications();
    updateUnreadLabel();
    showToast("All notifications marked as read.");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderNotifications();
    updateUnreadLabel();
    document.getElementById("mark-all-btn").addEventListener("click", markAllRead);
});
