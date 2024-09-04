"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Profile() {
  const { user, error } = useFetchUser();
  const [systemInfo, setSystemInfo] = useState({
    platform: "",
    userAgent: "",
    date: "",
    time: "",
    day: "",
    month: "",
    year: "",
    internetSpeed: { download: 0, upload: 0 },
  });

  // Function to measure internet speed
  const measureInternetSpeed = async () => {
    const startTime = Date.now();
    const image = new Image();
    image.src = `https://via.placeholder.com/1000x1000.png?cache_buster=${startTime}`;

    // Calculate download speed
    image.onload = () => {
      const duration = (Date.now() - startTime) / 1000; // seconds
      const bitsLoaded = 1000 * 1000 * 8; // 1000x1000 image in bits
      const speedBps = bitsLoaded / duration; // bits per second
      const speedKbps = speedBps / 1024; // kilobits per second
      const speedMbps = speedKbps / 1024; // megabits per second
      setSystemInfo((prev) => ({
        ...prev,
        internetSpeed: {
          download: parseFloat(speedMbps.toFixed(2)), // Convert to number
          upload: parseFloat((speedMbps / 2).toFixed(2)), // Convert to number
        },
      }));
    };
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      setSystemInfo((prev) => ({
        ...prev,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        // date: now.toLocaleDateString(undefined, options),
        time: now.toLocaleTimeString(),
        day: now.toLocaleDateString(undefined, { weekday: "long" }),
        month: now.toLocaleDateString(undefined, { month: "long" }),
        year: now.getFullYear().toString(), // Ensure year is a string
      }));
    };

    // Update time immediately and then every second
    updateTime();
    const interval = setInterval(updateTime, 1000);

    measureInternetSpeed();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const profileInfo = [
    { label: "Name", value: user?.name || "N/A" },
    { label: "Date", value: systemInfo.date || "N/A" },
    { label: "Time", value: systemInfo.time || "N/A" },
    { label: "Day", value: systemInfo.day || "N/A" },
    { label: "Month", value: systemInfo.month || "N/A" },
    { label: "Year", value: systemInfo.year || "N/A" },
    { label: "Platform", value: systemInfo.platform || "N/A" },
    { label: "User Agent", value: systemInfo.userAgent || "N/A" },
  ];

  const data = {
    labels: ["Download Speed (Mbps)", "Upload Speed (Mbps)"],
    datasets: [
      {
        label: "Internet Speed",
        data: [
          systemInfo.internetSpeed.download,
          systemInfo.internetSpeed.upload,
        ],
        backgroundColor: ["#4caf50", "#2196f3"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // For better responsiveness
    plugins: {
      legend: {
        position: "top", // Correct usage of the accepted literal type
      },
      title: {
        display: true,
        text: "Internet Speed",
      },
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>View Profile</Button>
      </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-4'>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              View your profile and system information.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            {error ? (
              <p className='text-red-500'>Failed to fetch user details.</p>
            ) : (
              <div className='grid gap-4'>
                {profileInfo.map((info, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-4 items-center gap-2 sm:gap-4'
                  >
                    <span className='font-medium text-right col-span-1'>
                      {info.label}:
                    </span>
                    <span className='col-span-3'>{info.value}</span>
                  </div>
                ))}
                {/* <div className='mt-4 h-64 sm:h-72'>
                <Bar data={data} options={options} />
              </div> */}
              </div>
            )}
          </div>
          {/* <DialogFooter>
          <Button onClick={} type='button'>Close</Button>
        </DialogFooter> */}
        </DialogContent>
    </Dialog>
  );
}

export default Profile;
