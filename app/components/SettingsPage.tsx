"use client";

import { User, Bell, Palette, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    username: "Alice",
    email: "alice@zenit.dev",
    emailNotifications: true,
    taskReminders: true,
    compactMode: false,
    profileVisibility: "team",
  });

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm px-8 py-6">
        <h1 className="text-2xl font-semibold mb-1">设置</h1>
        <p className="text-muted-foreground text-sm">管理你的账户和偏好设置</p>
      </header>

      <main className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-4xl">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="account" className="gap-2">
                <User size={16} />
                账号
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell size={16} />
                通知
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette size={16} />
                外观
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield size={16} />
                隐私
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">账号</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    管理你的基本账户信息
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        用户名
                      </div>
                      <Input
                        value={settings.username}
                        onChange={(e) =>
                          updateSetting("username", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">邮箱</div>
                      <Input
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <div className="font-medium">退出所有设备</div>
                      <div className="text-sm text-muted-foreground">
                        清除所有会话并重新登录
                      </div>
                    </div>
                    <Button variant="secondary">退出</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">通知</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    控制你接收的通知
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <div className="font-medium">邮件通知</div>
                      <div className="text-sm text-muted-foreground">
                        重要更新将发送到你的邮箱
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <div className="font-medium">任务提醒</div>
                      <div className="text-sm text-muted-foreground">
                        到期任务与提及提醒
                      </div>
                    </div>
                    <Switch
                      checked={settings.taskReminders}
                      onCheckedChange={(checked) =>
                        updateSetting("taskReminders", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">外观</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    界面密度与显示偏好
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <div className="font-medium">紧凑模式</div>
                      <div className="text-sm text-muted-foreground">
                        减少间距，提升信息密度
                      </div>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) =>
                        updateSetting("compactMode", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">隐私</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    控制你的个人资料可见范围
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4 gap-4">
                    <div>
                      <div className="font-medium">个人资料可见性</div>
                      <div className="text-sm text-muted-foreground">
                        设置其他人能看到你的信息范围
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 px-3 justify-between min-w-40"
                        >
                          {(
                            [
                              { value: "public", label: "公开" },
                              { value: "team", label: "仅团队" },
                              { value: "private", label: "私密" },
                            ] as const
                          ).find((o) => o.value === settings.profileVisibility)
                            ?.label ?? String(settings.profileVisibility)}
                          <span className="text-muted-foreground">▾</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            updateSetting("profileVisibility", "public")
                          }
                        >
                          公开
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            updateSetting("profileVisibility", "team")
                          }
                        >
                          仅团队
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            updateSetting("profileVisibility", "private")
                          }
                        >
                          私密
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
