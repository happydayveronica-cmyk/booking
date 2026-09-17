"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Room = "교과2실" | "수업나눔카페";
type Booking = {
  id: string;
  date: string;
  room: Room;
  period: number;
  name: string;
  purpose: string;
};

const rooms: Room[] = ["교과2실", "수업나눔카페"];
const periods = Array.from({ length: 8 }, (_, index) => index + 1);
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function makeMonthDays(base: Date) {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dateKey(today));
  const [room, setRoom] = useState<Room>(rooms[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("special-room-bookings");
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("special-room-bookings", JSON.stringify(bookings));
  }, [bookings]);

  const days = useMemo(() => makeMonthDays(month), [month]);
  const dayBookings = bookings.filter((booking) => booking.date === selectedDate && booking.room === room);
  const selectedBooking = bookings.find(
    (booking) => booking.date === selectedDate && booking.room === room && booking.period === selectedPeriod,
  );

  function moveMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectDay(day: Date) {
    setSelectedDate(dateKey(day));
    setMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    setSelectedPeriod(null);
    setNotice("");
  }

  function submitBooking(event: FormEvent) {
    event.preventDefault();
    if (!selectedPeriod || !name.trim() || !purpose.trim()) return;
    if (selectedBooking) {
      setNotice("이미 예약된 시간입니다.");
      return;
    }
    const booking: Booking = {
      id: crypto.randomUUID(),
      date: selectedDate,
      room,
      period: selectedPeriod,
      name: name.trim(),
      purpose: purpose.trim(),
    };
    setBookings((current) => [...current, booking]);
    setName("");
    setPurpose("");
    setSelectedPeriod(null);
    setNotice("예약이 완료되었습니다.");
  }

  function cancelBooking(id: string) {
    if (!window.confirm("이 예약을 취소할까요?")) return;
    setBookings((current) => current.filter((booking) => booking.id !== id));
    setSelectedPeriod(null);
    setNotice("예약을 취소했습니다.");
  }

  const selectedLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${selectedDate}T00:00:00`));

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <Image
            className="schoolLogo"
            src="/banpo-school-logo.png"
            alt="반포고등학교"
            width={1079}
            height={290}
            priority
          />
          <h1>반포고 면접 교실 예약</h1>
        </div>
        <div className="todayChip">오늘 · {today.getMonth() + 1}월 {today.getDate()}일</div>
      </header>

      <div className="roomTabs" aria-label="특별실 선택">
        {rooms.map((item) => (
          <button
            className={room === item ? "active" : ""}
            key={item}
            onClick={() => { setRoom(item); setSelectedPeriod(null); setNotice(""); }}
          >
            <span>{item === "교과2실" ? "02" : "C"}</span>
            <div><strong>{item}</strong><small>{item === "교과2실" ? "집중 수업 공간" : "함께 나누는 공간"}</small></div>
          </button>
        ))}
      </div>

      <section className="workspace">
        <article className="calendarCard">
          <div className="cardHead">
            <div><p>날짜 선택</p><h3>{month.getFullYear()}년 {month.getMonth() + 1}월</h3></div>
            <div className="monthNav">
              <button onClick={() => moveMonth(-1)} aria-label="이전 달">←</button>
              <button onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>오늘</button>
              <button onClick={() => moveMonth(1)} aria-label="다음 달">→</button>
            </div>
          </div>
          <div className="calendar">
            {weekdays.map((day) => <div className="weekday" key={day}>{day}</div>)}
            {days.map((day) => {
              const key = dateKey(day);
              const count = bookings.filter((booking) => booking.date === key && booking.room === room).length;
              const muted = day.getMonth() !== month.getMonth();
              return (
                <button
                  key={key}
                  className={`day ${selectedDate === key ? "selected" : ""} ${muted ? "muted" : ""}`}
                  onClick={() => selectDay(day)}
                >
                  <span>{day.getDate()}</span>
                  {count > 0 && <i>{count}</i>}
                </button>
              );
            })}
          </div>
        </article>

        <article className="scheduleCard">
          <div className="scheduleHead">
            <div><p>{room}</p><h3>{selectedLabel}</h3></div>
            <span>{8 - dayBookings.length}자리 남음</span>
          </div>
          <div className="periodGrid">
            {periods.map((period) => {
              const booked = dayBookings.find((booking) => booking.period === period);
              return (
                <button
                  key={period}
                  className={`${booked ? "booked" : "available"} ${selectedPeriod === period ? "chosen" : ""}`}
                  onClick={() => { setSelectedPeriod(period); setNotice(""); }}
                >
                  <b>{period}</b><span>교시</span>
                  <small>{booked ? booked.name : "예약 가능"}</small>
                </button>
              );
            })}
          </div>

          {selectedPeriod && (
            selectedBooking ? (
              <div className="bookingDetail">
                <div><p>{selectedPeriod}교시 예약 정보</p><strong>{selectedBooking.name}</strong><span>{selectedBooking.purpose}</span></div>
                <button onClick={() => cancelBooking(selectedBooking.id)}>예약 취소</button>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="bookingForm">
                <p><strong>{selectedPeriod}교시</strong> 예약하기</p>
                <label>예약자<input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" required /></label>
                <label>사용 목적<input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="예: 2학년 프로젝트 수업" required /></label>
                <button type="submit">예약 확정</button>
              </form>
            )
          )}
          {!selectedPeriod && <div className="emptyGuide">예약할 교시를 선택해 주세요.</div>}
          {notice && <div className="notice" role="status">{notice}</div>}
        </article>
      </section>

      <footer><span>특별실 예약</span><p>서로의 수업을 존중하는 작은 약속</p><small>예약 변경이 필요할 때는 해당 교시를 다시 선택해 주세요.</small></footer>
    </main>
  );
}
