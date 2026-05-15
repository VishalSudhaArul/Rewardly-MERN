import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../api';
import { toast } from 'react-hot-toast';
import { MapPin, Clock, LogIn, LogOut, History } from 'lucide-react';

export default function Attendance() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const [todayRes, mineRes] = await Promise.all([
        attendanceAPI.getToday(),
        attendanceAPI.getMine()
      ]);
      setStatus(todayRes.data);
      setHistory(mineRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkIn();
      toast.success('Checked in successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkOut();
      toast.success('Checked out successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <header className="page-header">
        <h1>Attendance Tracking</h1>
        <p>Log your daily attendance to earn consistent points.</p>
      </header>

      <div className="checkin-widget">
        <div className={`checkin-status ${status?.checkIn ? 'in' : 'out'}`}></div>
        <div style={{ flex: 1 }}>
          <div className="font-bold">
            {status?.checkIn ? `Checked in at ${new Date(`${status.date}T${status.checkIn}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'You are not checked in'}
          </div>
          <div className="text-muted text-sm">
            {status?.checkOut ? `Checked out at: ${new Date(`${status.date}T${status.checkOut}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Office hours: 09:00 AM - 06:00 PM'}
          </div>
        </div>
        {!status?.checkIn ? (
          <button className="btn btn-primary" onClick={handleCheckIn} disabled={loading}>
            <LogIn size={18} />
            Check In
          </button>
        ) : !status?.checkOut ? (
          <button className="btn btn-outline" onClick={handleCheckOut} disabled={loading} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
            <LogOut size={18} />
            Check Out
          </button>
        ) : (
          <button className="btn btn-outline" disabled>
            Completed
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title" style={{ margin: 0 }}>Attendance History</div>
          <History size={18} className="text-muted" />
        </div>
        
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((log) => {
                const checkInDate = log.checkIn ? new Date(`${log.date}T${log.checkIn}`) : null;
                const checkOutDate = log.checkOut ? new Date(`${log.date}T${log.checkOut}`) : null;
                
                let durationStr = '-';
                if (checkInDate && !isNaN(checkInDate) && checkOutDate && !isNaN(checkOutDate)) {
                  const diffMs = checkOutDate - checkInDate;
                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  durationStr = `${diffHrs}h ${diffMins}m`;
                }

                return (
                  <tr key={log._id}>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`tier-badge tier-${log.status === 'Present' ? 'Gold' : log.status === 'Late' ? 'Bronze' : 'Standard'}`} style={{ fontSize: '0.65rem' }}>
                        {log.status}
                      </span>
                    </td>
                    <td className="font-bold" style={{ color: 'var(--green)' }}>
                      {checkInDate && !isNaN(checkInDate.getTime()) ? checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </td>
                    <td className="font-bold" style={{ color: 'var(--red)' }}>
                      {checkOutDate && !isNaN(checkOutDate.getTime()) ? checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </td>
                    <td className="font-bold" style={{ color: 'var(--primary-light)' }}>
                      {durationStr}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }} className="text-muted">No attendance logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
