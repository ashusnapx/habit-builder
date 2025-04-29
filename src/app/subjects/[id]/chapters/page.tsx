"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapters, useCreateChapter, useSubject } from "@/hooks";
import ChapterCard from "@/components/ChapterCard";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { deleteChapter } from "@/lib/appwrite";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  PieChart as PieChartIcon,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Chapter = {
  createdAt: string;
  title: string;
  completed: boolean;
};

/**
 * ChaptersPage Component
 *
 * Displays and manages chapters for a specific subject with analytics,
 * different view modes, and interactive features.
 *
 * @returns {JSX.Element} The rendered ChaptersPage component
 */
const ChaptersPage = () => {
  // Extract and normalize the subject ID from URL parameters
  const { id: subjectIdParam } = useParams();
  const subjectId = Array.isArray(subjectIdParam)
    ? subjectIdParam[0]
    : subjectIdParam;

  // Custom hooks for data fetching and management
  const { chapters, loading, error, handleCompleteChange, refetchChapters } =
    useChapters(subjectId);

  const {
    addChapter,
    loading: addLoading,
    error: addError,
  } = useCreateChapter();

  const { fetchSubject } = useSubject();

  // Component state
  const [newChapters, setNewChapters] = useState("");
  const { width, height } = useWindowSize();
  const [isConfettiActive, setConfettiActive] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // grid, list, calendar
  const [sortCriteria, setSortCriteria] = useState("newest"); // newest, oldest, alphabetical, completion
  const [analyticsTab, setAnalyticsTab] = useState("overview");
  const [showCompleted, setShowCompleted] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  /**
   * Calculate and update analytics data when chapters change
   */
  useEffect(() => {
    // Calculate completion metrics
    const completed = chapters.filter((chapter) => chapter.completed);
    const completedCount = completed.length;
    const totalCount = chapters.length;
    const pending = totalCount - completedCount;

    setCompletedCount(completedCount);
    setPendingCount(pending);

    const newCompletionPercentage =
      totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    setCompletionPercentage(newCompletionPercentage);

    // Trigger confetti animation when all chapters are completed
    const allChaptersCompleted = chapters.every((chapter) => chapter.completed);
    if (allChaptersCompleted && chapters.length > 0) {
      setConfettiActive(true);
      const timer = setTimeout(() => setConfettiActive(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [chapters]);

  /**
   * Fetch subject title on component mount or when subject ID changes
   */
  useEffect(() => {
    const fetchSubjectTitle = async () => {
      if (subjectId) {
        try {
          const subjectData = await fetchSubject(subjectId);
          setSubjectTitle(subjectData?.title || "Unknown Subject");
        } catch (error) {
          console.error("Error fetching subject title:", error);
          setSubjectTitle("Unknown Subject");
        }
      }
    };

    fetchSubjectTitle();
  }, [subjectId, fetchSubject]);

  /**
   * Handle adding new chapters
   * Parses comma-separated chapter titles and adds them to the database
   */
  const handleAddChapter = useCallback(async () => {
    if (!subjectId || !newChapters.trim()) return;

    try {
      const titles = newChapters
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);

      if (titles.length === 0) return;

      await Promise.all(titles.map((title) => addChapter(subjectId, title)));
      setNewChapters("");
      refetchChapters();
    } catch (err) {
      console.error("Failed to add chapters:", err);
    }
  }, [subjectId, newChapters, addChapter, refetchChapters]);

  /**
   * Handle deletion of a chapter
   * @param {string} chapterId - ID of the chapter to delete
   */
  const handleDelete = useCallback(
    async (chapterId: string) => {
      try {
        await deleteChapter(chapterId);
        refetchChapters();
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    },
    [refetchChapters]
  );

  /**
   * Sort and filter chapters based on current criteria and filters
   */
  const sortedChapters = useMemo(() => {
    // Apply filters
    let filteredChapters = chapters;
    if (!showCompleted) {
      filteredChapters = chapters.filter((chapter) => !chapter.completed);
    }

    // Apply sorting
    return [...filteredChapters].sort((a: Chapter, b: Chapter): number => {
      switch (sortCriteria) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "completion":
          return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
        default:
          return 0;
      }
    });
  }, [chapters, sortCriteria, showCompleted]);

  /**
   * Prepare data for analytics charts
   */
  const analyticsData = useMemo(() => {
    // Completion status pie chart data
    const completionData = [
      { name: "Completed", value: completedCount, color: "#3b82f6" },
      { name: "Pending", value: pendingCount, color: "#9ca3af" },
    ];

    // Weekly progress data (simulated for demonstration)
    const today = new Date();
    const weeklyData = Array(7)
      .fill(0)
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });

        // Count completed chapters on this date (simulated)
        // In a real app, we would track completion dates
        return {
          name: dateStr,
          completed: Math.floor(Math.random() * 3), // Simulated data
        };
      })
      .reverse();

    return { completionData, weeklyData };
  }, [completedCount, pendingCount]);

  // Animation variants for elements
  const animations = {
    pageVariants: {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    },
    cardVariants: {
      initial: { opacity: 0, scale: 0.9 },
      in: { opacity: 1, scale: 1 },
      out: { opacity: 0, scale: 0.9 },
    },
    listItemVariants: {
      initial: { opacity: 0, x: -20 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: 20 },
    },
    progressBarVariants: {
      initial: { width: 0 },
      animate: { width: `${completionPercentage}%` },
    },
  };

  /**
   * Render loading skeleton while data is being fetched
   */
  if (loading) {
    return (
      <motion.div
        initial='initial'
        animate='in'
        exit='out'
        variants={animations.pageVariants}
        transition={{ duration: 0.5 }}
        className='container mx-auto p-6 mt-20 max-w-7xl'
      >
        <h1 className='text-4xl font-extrabold mb-6 text-gray-700 dark:text-gray-300'>
          Chapters
        </h1>
        <div className='w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700 mb-8'>
          <Skeleton className='h-4 rounded-full dark:bg-gray-600' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='p-4 border border-gray-200 rounded-lg shadow-md bg-white dark:border-gray-700 dark:bg-gray-800'
              >
                <Skeleton className='h-6 w-3/4 mb-4 dark:bg-gray-600' />
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-full dark:bg-gray-600' />
                  <Skeleton className='h-4 w-2/3 dark:bg-gray-600' />
                  <Skeleton className='h-8 w-full mt-6 dark:bg-gray-600' />
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    );
  }

  /**
   * Render error state if data fetching fails
   */
  if (error) {
    return (
      <motion.div
        initial='initial'
        animate='in'
        exit='out'
        variants={animations.pageVariants}
        transition={{ duration: 0.5 }}
        className='container mx-auto p-6 mt-20 max-w-7xl'
      >
        <h1 className='text-4xl font-extrabold mb-6 text-gray-900 dark:text-gray-100'>
          Chapters
        </h1>
        <Card className='bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'>
          <CardHeader>
            <CardTitle className='text-red-600 dark:text-red-400'>
              Error Loading Chapters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg text-red-600 dark:text-red-400'>{error}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => refetchChapters()}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={animations.pageVariants}
      transition={{ duration: 0.5 }}
      className='container mx-auto p-6 mt-20 max-w-7xl relative'
    >
      {/* Confetti animation for completion celebration */}
      {isConfettiActive && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Page Header with Subject Title */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className='text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight flex items-center capitalize mb-2'>
            {subjectTitle} <span className='ml-2'>📕</span>
          </h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Track and manage your learning progress
          </p>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-4 md:mt-0'
        >
          <div className='flex items-center gap-2 mb-2'>
            <Badge
              variant={completionPercentage === 100 ? "outline" : "default"}
              className='py-1'
            >
              {completionPercentage.toFixed(0)}% Complete
            </Badge>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {completedCount}/{chapters.length} chapters
            </span>
          </div>
          <div className='w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700'>
            <motion.div
              className='h-2 bg-blue-600 rounded-full'
              style={{ width: `${completionPercentage}%` }}
              variants={animations.progressBarVariants}
              initial='initial'
              animate='animate'
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='mb-8'
      >
        <Card className='border-blue-100 dark:border-blue-900/30'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-blue-700 dark:text-blue-400'>
              <PieChartIcon size={18} />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={analyticsTab}
              onValueChange={setAnalyticsTab}
              className='w-full'
            >
              <TabsList className='mb-4'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='weekly'>Weekly Progress</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='mt-0'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='col-span-1 flex flex-col justify-center items-center'>
                    <div className='mb-4 text-center'>
                      <p className='text-gray-500 dark:text-gray-400 mb-1'>
                        Completion Status
                      </p>
                      <div className='flex items-center justify-center gap-4'>
                        <div className='flex items-center'>
                          <div className='w-3 h-3 rounded-full bg-blue-500 mr-2'></div>
                          <span className='text-sm'>Completed</span>
                        </div>
                        <div className='flex items-center'>
                          <div className='w-3 h-3 rounded-full bg-gray-400 mr-2'></div>
                          <span className='text-sm'>Pending</span>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width='100%' height={180}>
                      <PieChart>
                        <Pie
                          data={analyticsData.completionData}
                          cx='50%'
                          cy='50%'
                          labelLine={false}
                          outerRadius={60}
                          innerRadius={40}
                          fill='#8884d8'
                          dataKey='value'
                          paddingAngle={5}
                        >
                          {analyticsData.completionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} chapters`, ""]}
                          labelFormatter={() => ""}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className='col-span-2'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <Card className='bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'>
                        <CardContent className='p-4'>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Total Chapters
                          </p>
                          <h3 className='text-2xl font-bold text-blue-700 dark:text-blue-400'>
                            {chapters.length}
                          </h3>
                        </CardContent>
                      </Card>

                      <Card className='bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30'>
                        <CardContent className='p-4'>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Completed
                          </p>
                          <h3 className='text-2xl font-bold text-green-700 dark:text-green-400'>
                            {completedCount}
                          </h3>
                        </CardContent>
                      </Card>

                      <Card className='bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30'>
                        <CardContent className='p-4'>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Pending
                          </p>
                          <h3 className='text-2xl font-bold text-amber-700 dark:text-amber-400'>
                            {pendingCount}
                          </h3>
                        </CardContent>
                      </Card>

                      {chapters.length > 0 && (
                        <Card className='col-span-2 md:col-span-3 bg-gray-50 dark:bg-gray-800/50'>
                          <CardContent className='p-4'>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                              Time to Complete
                            </p>
                            <p className='text-lg font-medium'>
                              Est. {pendingCount * 2} hours remaining
                              <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                                (based on 2 hrs/chapter)
                              </span>
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='weekly' className='mt-0'>
                <p className='text-sm text-center text-gray-500 dark:text-gray-400 mb-4'>
                  Chapters completed per day over the last week
                </p>
                <ResponsiveContainer width='100%' height={250}>
                  <BarChart
                    data={analyticsData.weeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='name' />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey='completed'
                      name='Chapters Completed'
                      fill='#3b82f6'
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* New Chapters Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className='mb-8'
      >
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>Add New Chapters</CardTitle>
            <CardDescription>
              Enter multiple chapters separated by commas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                value={newChapters}
                onChange={(e) => setNewChapters(e.target.value)}
                placeholder='E.g., Introduction, Basic Concepts, Advanced Topics'
                className='flex-1'
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddChapter();
                  }
                }}
              />
              <Button
                onClick={handleAddChapter}
                disabled={addLoading || newChapters.trim() === ""}
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                {addLoading ? "Adding..." : "Add Chapters"}
              </Button>
            </div>
            {addError && (
              <p className='text-red-600 mt-2 text-sm'>
                Error adding chapters: {addError.message}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Chapters View Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'
      >
        <div className='flex items-center gap-2'>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size='sm'
            onClick={() => setViewMode("grid")}
            className='rounded-l-md rounded-r-none'
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size='sm'
            onClick={() => setViewMode("list")}
            className='rounded-l-none rounded-r-md'
          >
            <List size={16} />
          </Button>

          <div className='ml-4 flex items-center space-x-2'>
            <Switch
              id='show-completed'
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor='show-completed'>Show completed</Label>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {sortedChapters.length}{" "}
            {sortedChapters.length === 1 ? "chapter" : "chapters"}{" "}
            {!showCompleted ? "(pending)" : ""}
          </div>

          <Select value={sortCriteria} onValueChange={setSortCriteria}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest First</SelectItem>
              <SelectItem value='oldest'>Oldest First</SelectItem>
              <SelectItem value='alphabetical'>Alphabetical</SelectItem>
              <SelectItem value='completion'>Completion Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Chapters Display */}
      <AnimatePresence mode='wait'>
        {sortedChapters.length === 0 ? (
          <motion.div
            key='empty'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-center py-12'
          >
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              {chapters.length === 0
                ? "No chapters added yet. Add your first chapter above!"
                : "No chapters match your current filters."}
            </p>
            {chapters.length > 0 && !showCompleted && (
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setShowCompleted(true)}
              >
                Show all chapters
              </Button>
            )}
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key='grid'
            initial='initial'
            animate='in'
            exit='out'
            variants={animations.cardVariants}
            transition={{ duration: 0.5 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          >
            {sortedChapters.map((chapter, index) => (
              <motion.div
                key={chapter.$id}
                variants={animations.cardVariants}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <ChapterCard
                  id={chapter.$id}
                  title={chapter.title}
                  completed={chapter.completed}
                  onCompleteChange={handleCompleteChange}
                  onDelete={handleDelete}
                  createdAt={chapter.createdAt}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key='list'
            initial='initial'
            animate='in'
            exit='out'
            variants={animations.listItemVariants}
            className='space-y-3'
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>Status</TableHead>
                  <TableHead>Chapter Title</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Created
                  </TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedChapters.map((chapter, index) => (
                  <motion.tr
                    key={chapter.$id}
                    variants={animations.listItemVariants}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b ${
                      chapter.completed
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                    layout
                  >
                    <TableCell>
                      <div className='flex items-center justify-center'>
                        <Switch
                          checked={chapter.completed}
                          onCheckedChange={(value) =>
                            handleCompleteChange(chapter.$id, value)
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>
                      <div
                        className={
                          chapter.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : ""
                        }
                      >
                        {chapter.title}
                      </div>
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-gray-500 dark:text-gray-400'>
                      {new Date(chapter.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(chapter.$id)}
                        className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChaptersPage;
