'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/tabs';
import TasksTab from '@/components/TasksTab';
import TimerTab from '@/components/TimerTab/index';
import useTimerStore from '@/stores/useTimerStore';
import useTasksStore from '@/stores/useTasksStore';
import useLog from '@/hooks/useLog';
import Menu from '@/components/Menu';

export default function App() {
  const { endTime, mode, isRunning, tickTimer, stopTimer } = useTimerStore(
    (state) => state,
  );
  const { fetchTasks, subscribeToTasks } = useTasksStore((state) => state);
  const [tick, setTick] = useState(0);
  const { log } = useLog();

  useEffect(() => {
    fetchTasks();
    subscribeToTasks();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTick(tick + 1);
      }, 1000);

      if (mode === 'break' && endTime! < Date.now()) {
        stopTimer();
        log();
        const audio = new Audio('/alarm.mp3');
        audio.play();
      }
    }

    tickTimer();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [tick, isRunning]);

  return (
    <div className='h-full flex flex-col justify-center'>
      <Menu />
      <Tabs
        fullWidth
        disableAnimation
        classNames={{
          tabList: 'bg-[#23223C]',
          cursor: 'bg-primary',
        }}
      >
        <Tab
          key="timer"
          title="Timer"
          className="data-[selected=true]:bg-secondary"
        >
          <TimerTab />
        </Tab>
        <Tab
          key="tasks"
          title="Tasks"
          className="data-[selected=true]:bg-secondary"
        >
          <TasksTab />
        </Tab>
      </Tabs>
    </div>
  );
}
