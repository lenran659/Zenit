'use client';

import { User, Bell, Palette, Shield, Database, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 用户设置
    username: 'Alice',
    email: 'alice@zenit.dev',
    avatar: 'A',
    
    // 通知设置
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyReport: true,
    
    // 主题设置
    theme: 'dark',
    accentColor: 'cyan',
    compactMode: false,
    
    // 隐私设置
    profileVisibility: 'team',
    activityTracking: true,
    
    // 数据设置
    autoSave: true,
    backupFrequency: 'daily',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      icon: User,
      title: '个人信息',
      description: '管理你的账户信息',
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      items: [
        { label: '用户名', value: settings.username, type: 'text', key: 'username' },
        { label: '邮箱', value: settings.email, type: 'text', key: 'email' },
      ]
    },
    {
      icon: Bell,
      title: '通知设置',
      description: '控制你接收的通知类型',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      items: [
        { label: '邮件通知', value: settings.emailNotifications, type: 'toggle', key: 'emailNotifications' },
        { label: '推送通知', value: settings.pushNotifications, type: 'toggle', key: 'pushNotifications' },
        { label: '任务提醒', value: settings.taskReminders, type: 'toggle', key: 'taskReminders' },
        { label: '周报', value: settings.weeklyReport, type: 'toggle', key: 'weeklyReport' },
      ]
    },
    {
      icon: Palette,
      title: '外观设置',
      description: '自定义界面外观',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      items: [
        { 
          label: '主题', 
          value: settings.theme, 
          type: 'select', 
          key: 'theme',
          options: [
            { value: 'dark', label: '暗黑模式' },
            { value: 'light', label: '明亮模式' },
          ]
        },
        { 
          label: '强调色', 
          value: settings.accentColor, 
          type: 'select', 
          key: 'accentColor',
          options: [
            { value: 'cyan', label: '青色' },
            { value: 'blue', label: '蓝色' },
            { value: 'purple', label: '紫色' },
            { value: 'green', label: '绿色' },
          ]
        },
        { label: '紧凑模式', value: settings.compactMode, type: 'toggle', key: 'compactMode' },
      ]
    },
    {
      icon: Shield,
      title: '隐私与安全',
      description: '保护你的数据安全',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      items: [
        { 
          label: '个人资料可见性', 
          value: settings.profileVisibility, 
          type: 'select', 
          key: 'profileVisibility',
          options: [
            { value: 'public', label: '公开' },
            { value: 'team', label: '仅团队' },
            { value: 'private', label: '私密' },
          ]
        },
        { label: '活动追踪', value: settings.activityTracking, type: 'toggle', key: 'activityTracking' },
      ]
    },
    {
      icon: Database,
      title: '数据管理',
      description: '管理你的数据和备份',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      items: [
        { label: '自动保存', value: settings.autoSave, type: 'toggle', key: 'autoSave' },
        { 
          label: '备份频率', 
          value: settings.backupFrequency, 
          type: 'select', 
          key: 'backupFrequency',
          options: [
            { value: 'realtime', label: '实时' },
            { value: 'daily', label: '每日' },
            { value: 'weekly', label: '每周' },
          ]
        },
      ]
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm px-8 py-6">
        <h1 className="text-2xl font-semibold mb-1">设置</h1>
        <p className="text-muted-foreground text-sm">管理你的账户和偏好设置</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-4xl space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`w-12 h-12 rounded-lg ${section.bg} flex items-center justify-center`}>
                  <section.icon size={24} className={section.color} />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">{section.description}</div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-6 flex items-center justify-between gap-4">
                      <span className="text-sm text-foreground">{item.label}</span>

                      {item.type === 'toggle' && (
                        <Switch
                          checked={Boolean(item.value)}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      )}

                      {item.type === 'text' && (
                        <Input
                          type="text"
                          value={item.value as string}
                          onChange={(e) => updateSetting(item.key, e.target.value)}
                          className="max-w-xs"
                        />
                      )}

                      {item.type === 'select' && 'options' in item && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 px-3 justify-between min-w-40"
                            >
                              {
                                item.options?.find(
                                  (option: { value: string; label: string }) => option.value === item.value
                                )?.label ?? String(item.value)
                              }
                              <span className="text-muted-foreground">▾</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.options?.map((option: { value: string; label: string }) => (
                              <DropdownMenuItem
                                key={option.value}
                                onSelect={() => updateSetting(item.key, option.value)}
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-destructive/30">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Zap size={24} className="text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg">危险区域</CardTitle>
                <div className="text-sm text-muted-foreground">不可逆的操作</div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="destructive" className="w-full">
                导出所有数据
              </Button>
              <Button variant="destructive" className="w-full">
                删除账户
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
