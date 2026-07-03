import { useMemo, useState } from "react";
export default function NotificationCenter({ notifications = [] }) {
 const [readIds,setReadIds]=useState([]);
 const unread=useMemo(()=>notifications.filter((item)=>!readIds.includes(item.id)).length,[notifications,readIds]);
 if (!notifications.length) return null;
 return <section className="notification-shell"><div className="section-heading"><h2>Notifications</h2><button className="secondary-button compact-button" onClick={()=>setReadIds(notifications.map((item)=>item.id))} type="button">Mark all read ({unread})</button></div><div className="notification-grid">{notifications.map((notification)=><article className={`notification-card notification-${notification.severity}`} key={notification.id}><strong>{notification.title}</strong><p>{notification.message}</p></article>)}</div></section>;
}
