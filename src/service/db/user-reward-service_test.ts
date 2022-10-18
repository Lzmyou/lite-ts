import { deepStrictEqual, strictEqual } from 'assert';

import { DbUserRewardService as Self } from './user-reward-service';
import { Mock } from '../assert';
import { IUnitOfWork, IUserRandSeedService, IUserValueService, UserServiceBase, ValueTypeServiceBase } from '../../contract';
import { contract } from '../../model';

describe('src/service/db/user-reward-service.ts', () => {
    describe('.findResults(uow: IUnitOfWork, rewards: IRewardData[][], scene?: string)', () => {
        it('固定', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 3,
                        valueType: 4,
                    }]
                ] : null;
            });

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    valueType: 1
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 6,
                source: 'test',
                targetNo: undefined,
                targetType: undefined,
                valueType: 4,
            }]);
        });

        it('权重', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', () => {
                return null;
            });

            mockRandSeedService.expectReturn(
                r => r.use(null, 2),
                11
            );

            const res = await self.findResults(null, [
                [{
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 10
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 3,
                    weight: 11
                }]
            ], 'test');
            deepStrictEqual(res, [{
                count: 2,
                source: 't2',
                targetNo: undefined,
                targetType: undefined,
                valueType: 3,
            }]);
        });
    });

    describe('.findResultsWithIndex(uow: IUnitOfWork, rewards: IRewardData[][], scene?: string)', () => {
        it('固定', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 3,
                        valueType: 4,
                    }]
                ] : null;
            });

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            const res = await self.findResultsWithIndex(null, [
                [{
                    count: 2,
                    valueType: 1
                }]
            ], 'test');
            deepStrictEqual(res, [
                [{
                    count: 6,
                    source: 'test',
                    targetNo: undefined,
                    targetType: undefined,
                    valueType: 4,
                }],
                0
            ]);
        });

        it('权重', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService(''),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', () => {
                return null;
            });

            mockRandSeedService.expectReturn(
                r => r.use(null, 2),
                11
            );

            const res = await self.findResultsWithIndex(null, [
                [{
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 10
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 3,
                    weight: 11
                }]
            ], 'test');
            deepStrictEqual(res, [
                [{
                    count: 2,
                    source: 't2',
                    targetNo: undefined,
                    targetType: undefined,
                    valueType: 3,
                }],
                1,
            ]);
        });
    });

    describe(`.preview(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][] }, scene = '')`, () => {
        it('ok', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService('test'),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 4,
                        valueType: 3,
                        weight: 1
                    }, {
                        count: 6,
                        valueType: 5,
                        weight: 1
                    }]
                ] : null;
            });

            mockRandSeedService.expectReturn(
                r => r.get(null, 2, 0),
                11
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 2),
                0
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 3),
                1
            );

            const rewards = [
                [{
                    count: 10,
                    source: 't2',
                    valueType: 1,
                    weight: 1
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 9
                }]
            ];
            const res = await self.preview(null, {
                '': rewards
            }, 'test');
            deepStrictEqual(res, {
                '': [{
                    count: 4,
                    valueType: 3
                }, {
                    count: 6,
                    valueType: 5
                }]
            });
            strictEqual(rewards.length, 1);
        });
    });


    describe(`.previewWithIndex(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][] }, scene = '')`, () => {
        it('ok', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null);

            const mockRandSeedService = new Mock<IUserRandSeedService>();
            mockUserService.expectReturn(
                r => r.getRandSeedService('test'),
                mockRandSeedService.actual
            );

            Reflect.set(self, 'findOpenRewards', (_: IUnitOfWork, arg: number) => {
                return arg == 1 ? [
                    [{
                        count: 4,
                        valueType: 3,
                        weight: 1
                    }, {
                        count: 6,
                        valueType: 5,
                        weight: 1
                    }]
                ] : null;
            });

            mockRandSeedService.expectReturn(
                r => r.get(null, 2, 0),
                11
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 2),
                0
            );

            mockRandSeedService.expectReturn(
                r => r.get(null, 1, 3),
                1
            );

            const rewards = [
                [{
                    count: 10,
                    source: 't2',
                    valueType: 1,
                    weight: 1
                }, {
                    count: 2,
                    source: 't2',
                    valueType: 1,
                    weight: 9
                }]
            ];
            const res = await self.previewWithIndex(null, {
                '': rewards
            }, 'test');
            deepStrictEqual(res, {
                '': [
                    [{
                        count: 4,
                        valueType: 3
                    }, {
                        count: 6,
                        valueType: 5
                    }],
                    0
                ]
            });
            strictEqual(rewards.length, 1);
        });
    });

    describe('.findOpenRewards(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockUserValueService = new Mock<IUserValueService>();
            const mockUserService = new Mock<UserServiceBase>({
                valueService: mockUserValueService.actual
            });
            const mockValueTypeService = new Mock<ValueTypeServiceBase>();
            const self = new Self(mockUserService.actual, mockValueTypeService.actual);

            mockValueTypeService.expectReturn(
                r => r.get('openRewards'),
                {
                    1: [
                        [{
                            count: 2,
                            weight: 10,
                            valueType: 3
                        }, {
                            count: 4,
                            weight: 20,
                            valueType: 5
                        }]
                    ] as contract.IReward[][]
                }
            );

            mockValueTypeService.expectReturn(
                r => r.get('rewardAddition'),
                {
                    1: {
                        3: 6
                    }
                } as {
                    [valueType: number]: {
                        [rewardValueType: number]: number;
                    };
                }
            );

            mockUserValueService.expectReturn(
                r => r.getCount(null, 6),
                90
            );

            const fn = Reflect.get(self, 'findOpenRewards').bind(self) as (_: IUnitOfWork, __: number) => Promise<contract.IReward[][]>;
            const res = await fn(null, 1);
            deepStrictEqual(res, [
                [{
                    count: 2,
                    weight: 100,
                    valueType: 3
                }, {
                    count: 4,
                    weight: 20,
                    valueType: 5
                }]
            ]);
        });
    });
});