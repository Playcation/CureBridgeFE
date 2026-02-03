import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './Calendar.css';
import { getMonthlySchedules, createSchedule } from '../../api/ContentApi';
import {ScheduleResponseDto} from '../../types/contentTypes'

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

// Helper to get day of week for the first day of the month (0 = Sunday)
const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

// Helper to format date as YYYY-MM-DD
const formatDate = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
};

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState<ScheduleResponseDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
    const [newScheduleTitle, setNewScheduleTitle] = useState('');
    const [newScheduleContent, setNewScheduleContent] = useState('');
    const [expandedScheduleIds, setExpandedScheduleIds] = useState<Set<number>>(new Set());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Use the first day of the month as the reference date
                const dateStr = formatDate(year, month, 1);
                const data = await getMonthlySchedules(dateStr);
                setSchedules(data);
            } catch (error) {
                console.error("Failed to fetch schedules:", error);
            }
        };
        fetchSchedules();
    }, [year, month]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate()));
    };

    const handleDayClick = (day: number) => {
        const dateStr = formatDate(year, month, day);
        setSelectedDate(dateStr);
    };

    const handleOpenModal = () => {
        setNewScheduleTitle('');
        setNewScheduleContent('');
        setIsModalOpen(true);
    };

    const handleCreateSchedule = async () => {
        if (!newScheduleTitle || !newScheduleContent) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }
        try {
            await createSchedule({
                date: selectedDate,
                title: newScheduleTitle,
                content: newScheduleContent
            });
            setIsModalOpen(false);
            // Refresh schedules
            const dateStr = formatDate(year, month, 1);
            const data = await getMonthlySchedules(dateStr);
            setSchedules(data);
        } catch (error) {
            console.error("Failed to create schedule:", error);
            alert('일정 등록에 실패했습니다.');
        }
    };

    const toggleScheduleExpand = (id: number) => {
        const newSet = new Set(expandedScheduleIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedScheduleIds(newSet);
    };

    const calendarDays = useMemo(() => {
        const days = [];
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday =
                i === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

            const dateStr = formatDate(year, month, i);
            const isSelected = dateStr === selectedDate;
            const daySchedules = schedules.filter(s => s.date === dateStr);

            days.push(
                <div key={`day-${i}`} className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => handleDayClick(i)}>
                    <span className="day-number">{i}</span>
                    <div className="schedule-dots">
                        {daySchedules.map(s => (
                            <div key={s.id} className="schedule-dot" title={s.title}></div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    }, [year, month, daysInMonth, firstDay, schedules, selectedDate]);

    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
    ];

    const selectedDateSchedules = useMemo(() => {
        return schedules.filter(s => s.date === selectedDate);
    }, [schedules, selectedDate]);

    return (
        <div className="calendar-page-container">
            <h2 className="page-title">캘린더</h2>

            <div className="calendar-content-wrapper">
                <div className="calendar-section">
                    <div className="calendar-header">
                        <div className="calendar-controls">
                            <button onClick={handlePrevMonth} className="nav-button">&lt;</button>
                            <span className="current-month">{year}년 {monthNames[month]}</span>
                            <button onClick={handleNextMonth} className="nav-button">&gt;</button>
                            <button onClick={handleToday} className="today-button">오늘</button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                            <div key={day} className="calendar-weekday">{day}</div>
                        ))}
                        {calendarDays}
                    </div>
                </div>

                <div className="schedule-list-section">
                    <div className="schedule-list-header">
                        <h3>{selectedDate} 일정</h3>
                        <button onClick={handleOpenModal} className="add-schedule-button">+</button>
                    </div>
                    <div className="schedule-list">
                        {selectedDateSchedules.length === 0 ? (
                            <div className="no-schedules">등록된 일정이 없습니다.</div>
                        ) : (
                            selectedDateSchedules.map(schedule => (
                                <div key={schedule.id} className="schedule-item">
                                    <div className="schedule-item-header">
                                        <span className="schedule-title">{schedule.title}</span>
                                        <button
                                            className="toggle-button"
                                            onClick={() => toggleScheduleExpand(schedule.id)}
                                        >
                                            {expandedScheduleIds.has(schedule.id) ? '▲' : '▼'}
                                        </button>
                                    </div>
                                    {expandedScheduleIds.has(schedule.id) && (
                                        <div className="schedule-content">
                                            {schedule.content}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>일정 등록 ({selectedDate})</h3>
                        <div className="form-group">
                            <label>제목</label>
                            <input
                                type="text"
                                value={newScheduleTitle}
                                onChange={(e) => setNewScheduleTitle(e.target.value)}
                                placeholder="일정 제목"
                            />
                        </div>
                        <div className="form-group">
                            <label>내용</label>
                            <textarea
                                value={newScheduleContent}
                                onChange={(e) => setNewScheduleContent(e.target.value)}
                                placeholder="일정 내용"
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)} className="cancel-button">취소</button>
                            <button onClick={handleCreateSchedule} className="save-button">저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
