import React, { useState } from 'react';
import { X, ShoppingBag, Shield, Sparkles, Check, Package, Coins } from 'lucide-react';
import { StudentData, GameItem, ItemCategory } from '../../types';
import { GAME_ITEMS, GameService } from '../../services/gameService';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { soundEffects } from '../../utils/soundEffects';

interface ShopModalProps {
  student: StudentData;
  onClose: () => void;
  onStudentUpdated: (student: StudentData) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ student, onClose, onStudentUpdated }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const categories: { id: ItemCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: '전체', icon: '🌟' },
    { id: 'weapon', name: '무기', icon: '⚔️' },
    { id: 'armor', name: '갑옷/의상', icon: '🦺' },
    { id: 'helmet', name: '모자/투구', icon: '👑' },
    { id: 'accessory', name: '장식/도구', icon: '🔮' },
    { id: 'cape', name: '망토/가방', icon: '🎒' },
    { id: 'pet', name: '펫', icon: '🐾' },
  ];

  const handleBuy = (item: GameItem) => {
    soundEffects.playClick();
    const res = GameService.buyItem(student.account.id, item.id);
    if (res.success && res.student) {
      soundEffects.playCoin();
      setStatusMessage({ text: res.message, isError: false });
      onStudentUpdated(res.student);
    } else {
      soundEffects.playWrong();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handleToggleEquip = (itemId: string) => {
    soundEffects.playClick();
    const res = GameService.toggleEquipItem(student.account.id, itemId);
    if (res.success && res.student) {
      setStatusMessage({ text: res.message, isError: false });
      onStudentUpdated(res.student);
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const filteredItems = GAME_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    // Show items suitable for student's job or common
    if (item.jobRequired && item.jobRequired !== 'all' && item.jobRequired !== student.character.job) {
      return false;
    }
    return true;
  });

  const inventoryItems = student.character.inventory
    .map((id) => GAME_ITEMS.find((i) => i.id === id))
    .filter(Boolean) as GameItem[];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0A0A0A] rounded-3xl border border-[#2A2A2A] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] p-4 text-white flex items-center justify-between border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-2xl shadow-inner">
              🛍️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">모험가 상점 & 인벤토리</h2>
              <p className="text-xs text-[#A1A1AA] font-normal">골드로 장비를 사고 나만의 캐릭터를 꾸며보세요!</p>
            </div>
          </div>

          {/* Gold Counter & Close */}
          <div className="flex items-center gap-3">
            <div className="bg-[#181818] text-[#F6D860] font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5 border border-[#333333] shadow-sm">
              <Coins className="w-4 h-4 text-[#D4AF37]" />
              <span>{student.character.gold} G</span>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1.5 bg-[#1C1C1C] hover:bg-[#262626] rounded-xl text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector & Notification */}
        <div className="bg-[#111111] px-4 py-2.5 border-b border-[#1F1F1F] flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('shop');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                  : 'bg-[#181818] text-[#A1A1AA] hover:bg-[#222222] border border-[#2A2A2A]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>아이템 상점</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('inventory');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-[#D4AF37] text-black shadow-md scale-105'
                  : 'bg-[#181818] text-[#A1A1AA] hover:bg-[#222222] border border-[#2A2A2A]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>내 인벤토리 ({student.character.inventory.length})</span>
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-xl animate-fade-in ${
                statusMessage.isError
                  ? 'bg-[#2A1215] text-[#FB7185] border border-[#FB7185]/40'
                  : 'bg-[#06281E] text-[#34D399] border border-[#34D399]/40'
              }`}
            >
              {statusMessage.text}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main: Items Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Categories in Shop */}
            {activeTab === 'shop' && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedCategory(c.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#D4AF37]/20 text-[#F6D860] border border-[#D4AF37]/50 shadow-sm'
                        : 'bg-[#141414] text-[#888888] hover:bg-[#1C1C1C] border border-[#222222]'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Shop Grid */}
            {activeTab === 'shop' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => {
                  const isOwned = student.character.inventory.includes(item.id);
                  const canAfford = student.character.gold >= item.price;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isOwned
                          ? 'bg-[#101010] border-[#1F1F1F] opacity-75'
                          : 'bg-[#121212] border-[#222222] hover:border-[#D4AF37]/60 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <h4 className="font-bold text-sm text-white">{item.name}</h4>
                              <span className="text-[10px] font-medium text-[#71717A]">{item.category}</span>
                            </div>
                          </div>

                          <div className="text-right font-bold text-xs text-[#F6D860]">
                            {item.isRare ? (
                              <span className="text-[#C084FC] bg-[#C084FC]/10 px-2 py-0.5 rounded-md border border-[#C084FC]/30">
                                🌟 희귀
                              </span>
                            ) : (
                              <span>{item.price} G</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#A1A1AA] leading-snug">{item.description}</p>
                        {item.unlockCondition && (
                          <div className="mt-1 text-[10px] font-bold text-[#C084FC]">
                            획득처: {item.unlockCondition}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#1C1C1C] flex items-center justify-between">
                        {isOwned ? (
                          <span className="text-xs font-bold text-[#34D399] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> 보유중
                          </span>
                        ) : item.isRare ? (
                          <span className="text-[11px] font-bold text-[#666666]">업적 해금 전용</span>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleBuy(item)}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-[#D4AF37] hover:bg-[#E6C35C] text-black shadow-sm active:scale-95'
                                : 'bg-[#181818] text-[#555555] cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? '구매하기' : 'Gold 부족'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Inventory Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inventoryItems.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-[#666666] font-bold text-sm">
                    인벤토리가 비어 있습니다. 상점에서 아이템을 구매해 보세요!
                  </div>
                ) : (
                  inventoryItems.map((item) => {
                    const isEquipped = (student.character.equipment as any)[item.category] === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                            : 'bg-[#121212] border-[#222222] hover:border-[#333333] shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className="font-bold text-sm text-white">{item.name}</h4>
                                <span className="text-[10px] font-medium text-[#D4AF37]">{item.category}</span>
                              </div>
                            </div>
                            {isEquipped && (
                              <span className="text-[11px] font-bold bg-[#D4AF37] text-black px-2 py-0.5 rounded-lg shadow-sm">
                                장착중
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#A1A1AA]">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#1C1C1C]">
                          <button
                            type="button"
                            onClick={() => handleToggleEquip(item.id)}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isEquipped
                                ? 'bg-[#1C1C1C] hover:bg-[#262626] text-[#CCCCCC]'
                                : 'bg-[#D4AF37] hover:bg-[#E6C35C] text-black shadow-sm'
                            }`}
                          >
                            {isEquipped ? '장착 해제' : '장착하기'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right Column: Real-time Character Fitting Room (4 cols) */}
          <div className="lg:col-span-4 bg-[#121212] rounded-3xl border border-[#222222] p-4 flex flex-col items-center justify-center space-y-3">
            <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
              실시간 피팅룸 미리보기
            </h3>
            <CharacterAvatar character={student.character} size="lg" isAnimated={true} />

            {/* Currently Equipped Summary */}
            <div className="w-full bg-[#181818] rounded-2xl p-3 border border-[#262626] text-xs space-y-1.5">
              <div className="font-bold text-white border-b border-[#222222] pb-1">장착 장비 현황</div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>무기</span>
                <span className="font-bold text-[#F6D860]">
                  {GAME_ITEMS.find((i) => i.id === student.character.equipment?.weapon)?.name || '없음'}
                </span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>갑옷</span>
                <span className="font-bold text-[#F6D860]">
                  {GAME_ITEMS.find((i) => i.id === student.character.equipment?.armor)?.name || '기본 튜닉'}
                </span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>모자</span>
                <span className="font-bold text-[#F6D860]">
                  {GAME_ITEMS.find((i) => i.id === student.character.equipment?.helmet)?.name || '없음'}
                </span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>망토/가방</span>
                <span className="font-bold text-[#F6D860]">
                  {GAME_ITEMS.find((i) => i.id === student.character.equipment?.cape)?.name || '없음'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111111] border-t border-[#1F1F1F] flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#1C1C1C] hover:bg-[#262626] text-[#CCCCCC] font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
